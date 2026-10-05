// Contests API client. Status (upcoming/live/ended) and the registered
// flag come from the server on every read — never computed here.
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

export const getContests = async () =>
  unwrap(await apiFetch("/contests"), "Load contests");

export const getContest = async (contestId) =>
  unwrap(await apiFetch(`/contests/${contestId}`), "Load contest");

export const registerForContest = async (contestId) =>
  unwrap(
    await apiFetch(`/contests/${contestId}/register`, { method: "POST" }),
    "Register for contest",
  );

export const unregisterFromContest = async (contestId) =>
  unwrap(
    await apiFetch(`/contests/${contestId}/register`, { method: "DELETE" }),
    "Cancel registration",
  );
