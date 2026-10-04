"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import SettingsRow from "@/components/settings/SettingsRow";
import EditModal from "@/components/settings/EditModal";
import GoBack from "@/components/ui/GoBack";
import { getProfile, updateProfile, getProfileStats } from "@/lib/api/profile";
import { Settings } from "lucide-react";

// Row definitions: UI key → API field. Static (never from the API).
// `api` is the Profile DTO key; `readOnly` rows never send a PATCH.
const FIELD_DEFS = [
  { key: "displayName", api: "displayName", label: "Display Name", icon: "user", inputType: "text", description: "Change your display name." },
  { key: "handle", api: "handle", label: "User ID", icon: "fingerprint", inputType: "text", description: "Your unique handle (letters, numbers, _)." },
  { key: "gender", api: "gender", label: "Gender", icon: "users", inputType: "select", options: ["Male", "Female", "Non-binary", "Prefer not to say"], description: "Select your gender." },
  { key: "dateOfBirth", api: "dateOfBirth", label: "Date of Birth", icon: "calendar", inputType: "date", description: "Your date of birth." },
  { key: "location", api: "location", label: "Location", icon: "mapPin", inputType: "text", description: "Where you're based." },
  { key: "dailyGoal", api: "dailyQuestionGoal", label: "Daily Goal", icon: "code", inputType: "text", description: "Questions per day you aim to solve." },
  { key: "website", api: "websiteUrl", label: "Website", icon: "globe", inputType: "url", description: "Your personal website or portfolio." },
  { key: "github", api: "githubUrl", label: "GitHub URL", icon: "github", inputType: "url", description: "Link your GitHub profile." },
  { key: "linkedin", api: "linkedinUrl", label: "LinkedIn URL", icon: "linkedin", inputType: "url", description: "Link your LinkedIn profile." },
  { key: "leetcode", api: "leetcodeUrl", label: "LeetCode URL", icon: "code", inputType: "url", description: "Link your LeetCode profile." },
  { key: "xId", api: "xUrl", label: "X @ID", icon: "atSign", inputType: "text", description: "Your X (Twitter) handle or URL." },
  { key: "bio", api: "bio", label: "Bio", icon: "fileText", inputType: "textarea", description: "Write a short bio about yourself." },
];

const toDateInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const formatMemberSince = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

// API DTO → form values keyed by FIELD_DEFS key.
function dtoToValues(dto) {
  return {
    displayName: dto.displayName || "",
    handle: dto.handle ? `@${dto.handle}` : "",
    gender: dto.gender || "",
    dateOfBirth: toDateInput(dto.dateOfBirth),
    location: dto.location || "",
    dailyGoal: dto.dailyQuestionGoal != null ? String(dto.dailyQuestionGoal) : "",
    website: dto.websiteUrl || "",
    github: dto.githubUrl || "",
    linkedin: dto.linkedinUrl || "",
    leetcode: dto.leetcodeUrl || "",
    xId: dto.xUrl || "",
    bio: dto.bio || "",
  };
}

// Form value → API payload for one field ("" clears nullable columns).
function toPayload(def, value) {
  const v = (value || "").trim();
  if (def.api === "dailyQuestionGoal") {
    if (!v) return { [def.api]: null };
    const n = Number(v);
    return { [def.api]: Number.isFinite(n) ? Math.round(n) : v };
  }
  if (def.api === "handle") {
    const h = v.replace(/^@/, "");
    return { [def.api]: h || null };
  }
  if (def.api === "displayName") return { [def.api]: v };
  return { [def.api]: v || null };
}

export default function SettingsPage() {
  // ── Remote state ──────────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Form state (mirrors the API once loaded) ──────────────────────
  const [values, setValues] = useState(() =>
    Object.fromEntries(FIELD_DEFS.map((f) => [f.key, ""])),
  );
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dto, stats] = await Promise.all([
          getProfile(),
          getProfileStats().catch(() => null),
        ]);
        if (cancelled) return;
        setProfile(dto);
        setStreak(stats?.currentStreak ?? null);
        setValues(dtoToValues(dto));
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleOpen = useCallback((field) => {
    setSaveError("");
    setActiveField(field);
  }, []);

  const handleClose = useCallback(() => {
    setActiveField(null);
  }, []);

  const handleSave = useCallback(
    async (newValue) => {
      if (!activeField || saving) return;
      setSaving(true);
      setSaveError("");
      try {
        const dto = await updateProfile(toPayload(activeField, newValue));
        setProfile(dto);
        setValues(dtoToValues(dto));
      } catch (err) {
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    },
    [activeField, saving],
  );

  const defs = useMemo(() => FIELD_DEFS, []);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* Go back */}
      <GoBack className="mb-6" />

      {/* ── Page header ──────────────────────────────────────────── */}
      <header className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-slate" />
        <h1 className="font-polysans text-heading-lg tracking-[-0.02em] text-graphite">Settings</h1>
      </header>

      {loading ? (
        <p className="mt-10 text-13 text-slate">Loading your settings…</p>
      ) : loadError ? (
        <div className="mt-10 rounded-2xl bg-ash p-6 text-13 text-steel">
          Couldn&apos;t load settings: {loadError}
        </div>
      ) : (
        <>
          {saveError && (
            <div className="mt-6 rounded-xl border border-ember/40 bg-ash px-5 py-3 text-13 text-ember">
              {saveError}
            </div>
          )}

          {/* ── Profile card + settings grid ─────────────────────────── */}
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {/* ── Left: Profile card ─────────────────────────────────── */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-ash p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-graphite font-polysans text-heading tracking-[-0.02em] text-inverse">
                    {profile?.initials || "?"}
                  </span>
                  <p className="mt-4 font-polysans text-subheading tracking-[-0.02em] text-graphite">
                    {profile?.displayName}
                  </p>
                  <p className="mt-1 text-13 text-slate">{profile?.email}</p>
                  <p className="mt-3 text-15 leading-[1.5] text-steel">
                    {profile?.bio}
                  </p>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-mist" />

                {/* Quick info */}
                <div className="space-y-3 text-13">
                  <div className="flex items-center justify-between">
                    <span className="text-slate">Member since</span>
                    <span className="font-polysans text-graphite">
                      {formatMemberSince(profile?.memberSince)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate">Streak</span>
                    <span className="font-polysans text-graphite">
                      {streak != null ? `${streak} days` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Settings sections ───────────────────────────── */}
            <div className="space-y-6 lg:col-span-8">
              {/* ── General Section ──────────────────────────────────── */}
              <section className="rounded-2xl bg-ash p-6">
                <div>
                  <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                    General
                  </h2>
                  <p className="mt-1 text-13 text-slate">
                    Manage your general account settings.
                  </p>
                </div>

                <div className="mt-5">
                  {defs.map((field) => (
                    <div key={field.key}>
                      <SettingsRow
                        icon={field.icon}
                        label={field.label}
                        value={values[field.key]}
                        onClick={() => handleOpen(field)}
                      />
                      {field !== defs[defs.length - 1] && (
                        <div className="mx-5 border-t border-mist" />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────── */}
      <EditModal
        open={activeField !== null}
        onClose={handleClose}
        onSave={handleSave}
        label={activeField?.label || ""}
        description={
          saving ? "Saving…" : activeField?.description || ""
        }
        value={activeField ? values[activeField.key] || "" : ""}
        inputType={activeField?.inputType || "text"}
        options={activeField?.options || []}
        readOnly={false}
      />
    </div>
  );
}
