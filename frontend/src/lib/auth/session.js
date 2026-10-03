// Application session handling for the Google-OAuth flow.
//
// After Google redirects back, the backend sets an httpOnly `refresh_token`
// cookie and lands the browser on /dashboard — no tokens in the URL.
// The short-lived access token lives ONLY in memory here and is obtained
// by calling POST /auth/refresh (the cookie is sent automatically).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let accessToken = null;
let refreshInFlight = null;

async function requestRefresh() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No active session");
  }

  const body = await res.json();
  accessToken = body.data.accessToken;
  return accessToken;
}

// Returns a valid access token, refreshing via the cookie when needed.
// Concurrent callers share a single refresh request.
export function getAccessToken() {
  if (accessToken) return Promise.resolve(accessToken);
  if (!refreshInFlight) {
    refreshInFlight = requestRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

// Authenticated fetch: Bearer access token, one retry after a refresh on 401.
export async function apiFetch(path, options = {}) {
  const token = await getAccessToken();

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    accessToken = null;
    const retryToken = await getAccessToken();
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${retryToken}`,
      },
    });
  }

  return res;
}

export async function logout() {
  accessToken = null;
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
