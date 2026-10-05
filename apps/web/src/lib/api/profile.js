// Profile API client (Phase 21). All calls go through the authenticated
// apiFetch helper (Bearer access token, cookie refresh). Shapes match the
// backend DTOs in profile.service.js / badge.service.js — no mock data.
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

export const getProfile = async () =>
  unwrap(await apiFetch("/profile"), "Load profile");

export const updateProfile = async (data) =>
  unwrap(
    await apiFetch("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    "Save profile",
  );

export const removeAvatar = async () =>
  unwrap(
    await apiFetch("/profile/avatar", { method: "DELETE" }),
    "Remove avatar",
  );

export const getProfileStats = async () =>
  unwrap(await apiFetch("/profile/stats"), "Load stats");

export const getPracticeHistory = async () =>
  unwrap(await apiFetch("/profile/history"), "Load history");

export const getHeatmap = async () =>
  unwrap(await apiFetch("/profile/heatmap"), "Load heatmap");

export const getSkills = async () =>
  unwrap(await apiFetch("/profile/skills"), "Load skills");

export const getContinueSession = async () =>
  unwrap(await apiFetch("/profile/continue"), "Load continue session");

export const getRecommendations = async () =>
  unwrap(await apiFetch("/profile/recommendations"), "Load recommendations");

export const getBadges = async () =>
  unwrap(await apiFetch("/profile/badges"), "Load badges");

export const getProgress = async () =>
  unwrap(await apiFetch("/profile/progress"), "Load progress");
