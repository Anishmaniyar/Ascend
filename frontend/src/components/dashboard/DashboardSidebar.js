"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  Pencil,
  ChevronDown,
  ChevronUp,
  Github,
  Linkedin,
  Globe,
  Calendar,
  Target,
  BarChart3,
} from "lucide-react";
import { user, profileSkills } from "@/lib/mock/dashboard";
import Button from "@/components/ui/Button";

const VISIBLE_COUNT = 3;

const SOCIAL_LINKS = [
  { key: "github", label: "GitHub", icon: Github, baseUrl: "https://github.com/" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, baseUrl: "https://linkedin.com/in/" },
  { key: "xId", label: "X", icon: null, baseUrl: "https://x.com/", prefix: "@" },
  { key: "leetcode", label: "LeetCode", icon: null, baseUrl: "https://leetcode.com/u/" },
  { key: "website", label: "Website", icon: Globe, baseUrl: "https://" },
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
      <section className="rounded-2xl border border-mist bg-ash p-5">
        {/* Row 1: Avatar + Name/ID */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-graphite font-polysans text-lg tracking-[-0.02em] text-inverse">
              {user.initials}
            </span>
          )}

          {/* Name + ID in column */}
          <div className="min-w-0">
            <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
              {user.displayName}
            </p>
            <p className="mt-0.5 truncate text-13 text-slate">@{user.userId}</p>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-13 leading-[1.5] text-steel">{user.bio}</p>
        )}

        {/* Info rows — one item per row */}
        <div className="mt-4 space-y-2.5">
          {/* Location */}
          {user.location && (
            <div className="flex items-center gap-2.5 text-13">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate" />
              <span className="text-graphite">{user.location}</span>
            </div>
          )}

          {/* DOB */}
          {user.dob && (
            <div className="flex items-center gap-2.5 text-13">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-slate" />
              <span className="text-graphite">{user.dob}</span>
            </div>
          )}

          {/* Member Since */}
          {user.memberSince && (
            <div className="flex items-center gap-2.5 text-13">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-slate" />
              <span className="text-graphite">Member since {user.memberSince}</span>
            </div>
          )}

          {/* Target Companies */}
          {user.targetCompanies?.length > 0 && (
            <div className="flex items-center gap-2.5 text-13">
              <Target className="h-3.5 w-3.5 shrink-0 text-slate" />
              <span className="text-graphite">{user.targetCompanies.join(" · ")}</span>
            </div>
          )}

          {/* Social links — one per row */}
          {SOCIAL_LINKS.map((link) => {
            const value = user[link.key];
            if (!value) return null;

            const Icon = link.icon;
            const display = link.prefix ? `${link.prefix}${value}` : value;
            const url = `${link.baseUrl}${value}`;

            return (
              <a
                key={link.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-13 text-graphite transition-colors hover:text-ember"
              >
                {Icon ? (
                  <Icon className="h-3.5 w-3.5 shrink-0 text-slate" />
                ) : (
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded bg-fog font-polysans text-9 font-medium text-slate">
                    {link.label.charAt(0)}
                  </span>
                )}
                <span className="truncate underline-offset-2 hover:underline">{display}</span>
              </a>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <Button render={<Link href="/settings" />} variant="secondary" className="flex-1">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button render={<Link href="/progress" />} variant="primary" className="flex-1">
            <BarChart3 className="h-4 w-4" />
            Progress
          </Button>
        </div>
      </section>

      {/* ── Skills Card ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-mist bg-ash p-5">
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
