// Discussions API client.
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

export const getDiscussions = async () =>
  unwrap(await apiFetch("/discussions"), "Load discussions");

export const createDiscussion = async ({ title, content, tag }) =>
  unwrap(
    await apiFetch("/discussions", {
      method: "POST",
      body: JSON.stringify({ title, content, tag }),
    }),
    "Create discussion",
  );
