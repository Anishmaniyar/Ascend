"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  LayersIcon,
  BuildingIcon,
  ClockIcon,
  ChatIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  FlameIcon,
} from "@/components/ui/icons";
import { user } from "@/lib/mock/dashboard";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/topics", label: "Topics", icon: LayersIcon },
  { href: "/sheets", label: "Company Sheets", icon: BuildingIcon },
  { href: "/practice-history", label: "Practice History", icon: ClockIcon },
  { href: "/discussions", label: "Discussions", icon: ChatIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-polysans text-base tracking-[-0.02em] text-graphite">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-graphite">
        <span className="h-2 w-2 rounded-full bg-ember" />
      </span>
      LeetAptitude
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navList = (onNavigate) =>
    NAV.map((item) => {
      const active = pathname === item.href;
      const Icon = item.icon;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-nav-pills px-4 py-2.5 font-polysans text-15 tracking-[-0.02em] transition-colors ${
            active
              ? "bg-ash text-graphite"
              : "text-slate hover:bg-fog hover:text-graphite"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" />
          {item.label}
        </Link>
      );
    });

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-mist bg-canvas px-6 py-4 lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-graphite"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-mist bg-canvas lg:flex">
        <div className="px-6 py-7">
          <Wordmark />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">{navList(undefined)}</nav>

        <div className="space-y-3 px-3 pb-6">
          {/* Streak mini card */}
          <div className="flex items-center gap-3 rounded-asymmetric bg-ash px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ember">
              <FlameIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-polysans text-15 tracking-[-0.02em] text-graphite">
                {user.streak} day streak
              </p>
              <p className="text-13 text-slate">Keep it up!</p>
            </div>
          </div>

          {/* User chip */}
          <div className="flex items-center gap-3 border-t border-mist pt-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-graphite font-polysans text-13 text-inverse">
              {user.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-15 text-graphite">{user.name}</p>
              <p className="truncate text-13 text-slate">{user.email}</p>
            </div>
            {/* TODO: wire to logout */}
            <button type="button" aria-label="Log out" className="text-slate transition-colors hover:text-graphite">
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-graphite/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-mist bg-canvas">
            <div className="flex items-center justify-between px-6 py-5">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-graphite"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3">
              {navList(() => setOpen(false))}
            </nav>
            <div className="px-3 pb-6">
              <div className="flex items-center gap-3 border-t border-mist px-1 pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-graphite font-polysans text-13 text-inverse">
                  {user.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-15 text-graphite">{user.name}</p>
                  <p className="truncate text-13 text-slate">{user.email}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
