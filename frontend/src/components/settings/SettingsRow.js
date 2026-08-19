"use client";

import {
  User,
  Fingerprint,
  Users,
  Calendar,
  MapPin,
  Globe,
  GitFork,
  Link,
  Code,
  AtSign,
  FileText,
  ChevronRight,
} from "lucide-react";

const ICON_MAP = {
  user: User,
  fingerprint: Fingerprint,
  users: Users,
  calendar: Calendar,
  mapPin: MapPin,
  globe: Globe,
  github: GitFork,
  linkedin: Link,
  code: Code,
  atSign: AtSign,
  fileText: FileText,
};

export default function SettingsRow({ icon, label, value, onClick }) {
  const Icon = ICON_MAP[icon] || User;
  const displayValue = value || "Not set";
  const hasValue = !!value;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-fog"
    >
      {/* Icon */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fog transition-colors group-hover:bg-mist">
        <Icon className="h-4 w-4 text-steel transition-colors group-hover:text-ember" />
      </span>

      {/* Label + value */}
      <div className="min-w-0 flex-1">
        <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
          {label}
        </p>
        <p
          className={`mt-0.5 text-13 ${
            hasValue ? "text-steel" : "text-slate/60 italic"
          }`}
        >
          {displayValue}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-4 w-4 shrink-0 text-slate/40 transition-colors group-hover:text-ember" />
    </button>
  );
}
