"use client";

import { useEffect, useState } from "react";
import { getProfile, getProfileStats } from "@/lib/api/profile";

// Shared current-user state for layout chrome (Sidebar, AppNavbar).
// Fetched once per page load, then served from the module cache so every
// mount doesn't refetch. Returns { user, streak, loading } where user is the
// Profile DTO (or null when unauthenticated / failed).
let cached = null;
let inflight = null;

function load() {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = Promise.all([
      getProfile().catch(() => null),
      getProfileStats().catch(() => null),
    ])
      .then(([profile, stats]) => {
        cached = {
          profile,
          streak: stats?.currentStreak ?? null,
        };
        return cached;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useCurrentUser() {
  const [state, setState] = useState(cached || { profile: null, streak: null });
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    load().then((data) => {
      if (!cancelled) {
        setState(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    user: state.profile,
    streak: state.streak,
    loading,
  };
}

// Display fallbacks while loading (never Anish's mock data).
export const ANONYMOUS = { displayName: "", initials: "?", email: "" };
