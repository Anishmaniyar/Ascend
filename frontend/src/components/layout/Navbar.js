"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { GitHubIcon, MenuIcon, XIcon } from "@/components/ui/icons";
import Logo from "@/components/ui/Logo";

const LINKS = [
  { href: "/topics", label: "Topics" },
  { href: "/sheets", label: "Company Sheets" },
  { href: "/discussions", label: "Discussions" },
  { href: "/dashboard", label: "Progress" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mist bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[var(--page-max-width)] items-center justify-between gap-4 px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
        >
          <Logo className="h-7 w-7" />
          <span className="font-polysans text-base tracking-[-0.02em] text-graphite">
            LeetAptitude
          </span>
        </Link>

        {/* Pill nav container */}
        <nav className="hidden items-center gap-1 rounded-nav-pills bg-ash px-2 py-1.5 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-nav-pills px-4 py-1.5 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:text-ember"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* TODO: point to real GitHub repo */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden text-graphite transition-colors hover:text-ember sm:block"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="hidden font-polysans text-15 tracking-[-0.02em] text-slate transition-colors hover:text-graphite sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded-buttons bg-graphite px-5 py-2 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85 sm:block"
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-graphite md:hidden"
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-mist bg-canvas px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 font-polysans text-15 tracking-[-0.02em] text-graphite transition-colors hover:bg-ash"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3 border-t border-mist pt-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-buttons border border-graphite px-5 py-2 text-center font-polysans text-15 tracking-[-0.02em] text-graphite"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-buttons bg-graphite px-5 py-2 text-center font-polysans text-15 tracking-[-0.02em] text-inverse"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
