// Questions API client. Reads never include solutions or isCorrect.
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

export const getQuestions = async (subtopicId) =>
  unwrap(
    await apiFetch(`/question/?subtopicId=${subtopicId}`),
    "Load questions",
  );

export const getQuestion = async (questionId) =>
  unwrap(await apiFetch(`/question/${questionId}`), "Load question");
