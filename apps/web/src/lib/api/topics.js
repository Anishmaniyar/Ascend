// Curriculum + sheets API client. Shapes match topic.service.js.
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

export const getTopics = async () =>
  unwrap(await apiFetch("/topic/"), "Load topics");

export const getSubtopics = async (topicId) =>
  unwrap(await apiFetch(`/topic/${topicId}/subtopics`), "Load subtopics");

export const getSheets = async () =>
  unwrap(await apiFetch("/topic/sheets"), "Load sheets");

export const getSheetQuestions = async (sheetId) =>
  unwrap(
    await apiFetch(`/topic/sheets/${sheetId}/questions`),
    "Load sheet questions",
  );
