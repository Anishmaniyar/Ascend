"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { user, profileSkills } from "@/lib/mock/dashboard";

const VISIBLE_COUNT = 3;

const SOCIAL_FIELDS = [
  { key: "location", label: "Location", icon: MapPin },
  { key: "xId", label: "X", prefix: "@" },
  { key: "github", label: "GitHub", icon: ExternalLink },
  { key: "linkedin", label: "LinkedIn", icon: ExternalLink },
  { key: "leetcode", label: "LeetCode", icon: ExternalLink },
  { key: "website", label: "Website", icon: ExternalLink },
];

const LEVEL_META = {
  advanced: { label: "Advanced", color: "bg-ember" },
  intermediate: { label: "Intermediate", color: "bg-brass" },
  fundamental: { label: "Fundamental", color: "bg-graphite" },
};

function SkillGroup({ level }) {
  const [expanded, setExpanded] = useState(false);
  const meta = LEVEL_META[level];
  const all = profileSkills.filter((s) => s.level === level);
  const visible = expanded ? all : all.slice(0, VISIBLE_COUNT);
  const hasMore = all.length > VISIBLE_COUNT;

  return (
    <div className="space-y-2">
      {/* Level label */}
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${meta.color}`} />
        <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
          {meta.label}
        </p>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-1.5">
        {visible.map((skill) => (
          <span
            key={skill.name}
            className="inline-flex items-center gap-1 rounded-tags bg-fog px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-graphite"
          >
            {skill.name}
            <span className="text-slate">×{skill.solved}</span>
          </span>
        ))}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-13 text-slate transition-colors hover:text-graphite"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function DashboardSidebar() {
  return (
    <aside className="w-full space-y-6 lg:sticky lg:top-20 lg:w-72 lg:shrink-0">
      {/* ── Profile Card ──────────────────────────────────────────────── */}
      <section className="p-0">
        {/* Avatar */}
        <div className="flex justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="h-20 w-20 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-graphite font-polysans text-heading tracking-[-0.02em] text-inverse">
              {user.initials}
            </span>
          )}
        </div>

        {/* Name + userId */}
        <div className="mt-4 text-center">
          <p className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
            {user.displayName}
          </p>
          <p className="mt-1 text-13 text-slate">@{user.userId}</p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 text-center text-15 leading-[1.5] text-steel">{user.bio}</p>
        )}

        {/* Social / Profile Info — only non-empty fields */}
        {SOCIAL_FIELDS.some((f) => user[f.key]) && (
          <div className="mt-5 space-y-2.5">
            {SOCIAL_FIELDS.map((field) => {
              const value = user[field.key];
              if (!value) return null;

              const Icon = field.icon;
              const display = field.prefix ? `${field.prefix}${value}` : value;
              const isUrl = field.key !== "location" && field.key !== "xId";

              return (
                <div
                  key={field.key}
                  className="flex items-center gap-2.5 text-13"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-slate" />
                  {isUrl ? (
                    <a
                      href={value.startsWith("http") ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-graphite underline-offset-2 hover:underline"
                    >
                      {display}
                    </a>
                  ) : (
                    <span className="truncate text-graphite">{display}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Profile */}
        <Link
          href="/settings"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-buttons border border-graphite bg-transparent px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-graphite hover:text-inverse"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Link>
      </section>

      {/* ── Skills Card ───────────────────────────────────────────────── */}
      <section className="p-0">
        <h2 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
          Skills
        </h2>

        <div className="mt-5 space-y-5">
          <SkillGroup level="advanced" />
          <SkillGroup level="intermediate" />
          <SkillGroup level="fundamental" />
        </div>
      </section>
    </aside>
  );
}
