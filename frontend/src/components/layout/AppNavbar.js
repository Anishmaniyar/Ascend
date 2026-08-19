"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, Flame, ChevronDown, LogOut, Settings, Palette, BarChart3, LayoutDashboard } from "lucide-react";
import { user } from "@/lib/mock/dashboard";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/topics", label: "Topics" },
  { href: "/sheets", label: "Sheets" },
  { href: "/practice-history", label: "Practice" },
  { href: "/contests", label: "Contests" },
  { href: "/discussions", label: "Discussions" },
];

const PROFILE_MENU = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice-history", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/appearance", label: "Appearance", icon: Palette },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-mist bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[var(--page-max-width)] items-center justify-between px-6">
        {/* Left: Brand + Nav links */}
        <div className="flex items-center gap-8">
          {/* Logo — no navigation for logged-in users */}
          <div className="flex shrink-0 items-center gap-2.5 select-none">
            <Logo className="h-7 w-7" />
            <span className="font-polysans text-base tracking-[-0.02em] text-graphite">
              LeetAptitude
            </span>
          </div>

          {/* Nav links — pill style */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-nav-pills px-3.5 py-1.5 font-polysans text-15 tracking-[-0.02em] transition-colors ${
                    active
                      ? "bg-ash text-graphite"
                      : "text-slate hover:text-graphite"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Notifications, Streak, Profile */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-full p-2 text-slate transition-colors hover:bg-ash hover:text-graphite"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot — show when there are unread notifications */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-ember" />
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate transition-colors hover:bg-ash">
            <Flame className="h-4 w-4 text-ember" />
            <span className="font-polysans text-15 tracking-[-0.02em] text-graphite">
              {user.streak}
            </span>
          </div>

          {/* Profile avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="Profile menu"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-ash"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-graphite font-polysans text-13 text-inverse">
                {user.initials}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-mist bg-canvas py-1.5 shadow-lg">
                {/* User info header */}
                <div className="border-b border-mist px-4 py-3">
                  <p className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
                    {user.name}
                  </p>
                  <p className="truncate text-13 text-slate">{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {PROFILE_MENU.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-ash"
                      >
                        <Icon className="h-4 w-4 text-slate" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Sign out */}
                <div className="border-t border-mist pt-1.5">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-2 font-polysans text-15 tracking-[-0.02em] text-danger transition-colors hover:bg-ash"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav — horizontal scroll */}
      <div className="overflow-x-auto border-t border-mist px-6 md:hidden">
        <nav className="flex items-center gap-1 py-2">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-nav-pills px-3.5 py-1.5 font-polysans text-15 tracking-[-0.02em] transition-colors ${
                  active
                    ? "bg-ash text-graphite"
                    : "text-slate hover:text-graphite"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
