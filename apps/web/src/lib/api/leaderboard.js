// Leaderboard API client.
import { apiFetch } from "@/lib/auth/session";

async function unwrap(res, what) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `${what}: ${body.message || `Request failed (${res.status})`}`,
    );
  }
  return body.data;
}

export const getLeaderboard = async ({ period = "alltime", sort = "score" } = {}) =>
  unwrap(
    await apiFetch(
      `/leaderboard?period=${period}&sort=${sort}`,
    ),
    "Load leaderboard",
  );
