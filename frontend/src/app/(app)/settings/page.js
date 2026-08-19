"use client";

import { useState, useCallback } from "react";
import SettingsRow from "@/components/settings/SettingsRow";
import EditModal from "@/components/settings/EditModal";
import { generalSettings, experienceSettings } from "@/lib/mock/settings";
import { user } from "@/lib/mock/dashboard";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  // ── State ─────────────────────────────────────────────────────────────
  const [values, setValues] = useState(() => {
    const map = {};
    generalSettings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  });

  const [activeField, setActiveField] = useState(null);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleOpen = useCallback((setting) => {
    setActiveField(setting);
  }, []);

  const handleClose = useCallback(() => {
    setActiveField(null);
  }, []);

  const handleSave = useCallback(
    (newValue) => {
      if (!activeField) return;
      setValues((prev) => ({ ...prev, [activeField.key]: newValue }));
    },
    [activeField]
  );

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <header className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-slate" />
        <h1 className="text-heading-lg text-graphite">Settings</h1>
      </header>

      {/* ── Profile card + settings grid ─────────────────────────────── */}
      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        {/* ── Left: Profile card ─────────────────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-ash p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-graphite font-polysans text-heading tracking-[-0.02em] text-inverse">
                {user.initials}
              </span>
              <p className="mt-4 font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {user.name}
              </p>
              <p className="mt-1 text-13 text-slate">{user.email}</p>
              <p className="mt-3 text-15 leading-[1.5] text-steel">
                {user.bio}
              </p>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-mist" />

            {/* Quick info */}
            <div className="space-y-3 text-13">
              <div className="flex items-center justify-between">
                <span className="text-slate">Member since</span>
                <span className="font-polysans text-graphite">
                  {user.memberSince}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate">Streak</span>
                <span className="font-polysans text-graphite">
                  {user.streak} days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Settings sections ───────────────────────────────── */}
        <div className="space-y-6 lg:col-span-8">
          {/* ── General Section ──────────────────────────────────────── */}
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
              {generalSettings.map((setting) => (
                <div key={setting.key}>
                  <SettingsRow
                    icon={setting.icon}
                    label={setting.label}
                    value={values[setting.key]}
                    onClick={() => handleOpen(setting)}
                  />
                  {setting !== generalSettings[generalSettings.length - 1] && (
                    <div className="mx-5 border-t border-mist" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Experience Section ───────────────────────────────────── */}
          <section className="rounded-2xl bg-ash p-6">
            <div>
              <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
                Experience
              </h2>
              <p className="mt-1 text-13 text-slate">
                Manage your LeetAptitude experience.
              </p>
            </div>

            <div className="mt-5">
              {experienceSettings.length === 0 ? (
                <div className="rounded-lg bg-fog px-5 py-8 text-center text-13 text-slate">
                  No experience settings yet. Check back soon.
                </div>
              ) : (
                experienceSettings.map((setting) => (
                  <div key={setting.key}>
                    <SettingsRow
                      icon={setting.icon}
                      label={setting.label}
                      value={values[setting.key]}
                      onClick={() => handleOpen(setting)}
                    />
                    {setting !==
                      experienceSettings[experienceSettings.length - 1] && (
                      <div className="mx-5 border-t border-mist" />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────────── */}
      <EditModal
        open={activeField !== null}
        onClose={handleClose}
        onSave={handleSave}
        label={activeField?.label || ""}
        description={activeField?.description || ""}
        value={activeField ? values[activeField.key] || "" : ""}
        inputType={activeField?.inputType || "text"}
        options={activeField?.options || []}
        readOnly={activeField?.inputType === "readonly"}
      />
    </div>
  );
}
