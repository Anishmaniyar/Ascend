// Practice-session API client. Start with subtopicId or sheetId (one of
// the two is required); submit per-question attempts; complete; review.
import { apiFetch } from "@/lib/auth/session";

async function unwrap(res, what) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      body.errors?.map((e) => `${e.field}: ${e.message}`).join("; ") ||
      body.message ||
      `Request failed (${res.status})`;
    throw new Error(`${what}: ${detail}`);
  }
  return body.data;
}

const post = (path, data) =>
  apiFetch(path, { method: "POST", body: JSON.stringify(data) });

export const startSession = async ({ subtopicId, sheetId, mode }) =>
  unwrap(
    await post("/practice-session/", { subtopicId, sheetId, mode }),
    "Start session",
  );

export const getSession = async (sessionId) =>
  unwrap(
    await apiFetch(`/practice-session/${sessionId}`),
    "Load session",
  );

export const submitAttempt = async (sessionId, questionId, selectedOptionId) =>
  unwrap(
    await post(`/practice-session/${sessionId}/attempts`, {
      questionId,
      selectedOptionId,
    }),
    "Submit answer",
  );

export const completeSession = async (sessionId) =>
  unwrap(
    await apiFetch(`/practice-session/${sessionId}/complete`, {
      method: "PATCH",
    }),
    "Complete session",
  );

export const getResults = async (sessionId) =>
  unwrap(
    await apiFetch(`/practice-session/${sessionId}/results`),
    "Load results",
  );
