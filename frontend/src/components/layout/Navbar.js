"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { MenuIcon, XIcon, ArrowRightIcon } from "@/components/ui/icons";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "#topics", label: "Topics" },
  { href: "#sheets", label: "Sheets" },
  { href: "#leaderboard", label: "Leaderboards" },
  { href: "#contests", label: "Contests" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Track scroll position for navbar background
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    handleScroll(); // check on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-250 ${
        scrolled
          ? "border-b border-mist bg-canvas shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[var(--page-max-width)] items-center justify-between gap-4 px-6">
        {/* ── Left: Brand ─────────────────────────────────────────────── */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="font-polysans text-base tracking-[-0.02em] text-graphite">
            LeetAptitude
          </span>
        </Link>

        {/* ── Center: Navigation ──────────────────────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-nav-pills px-4 py-1.5 font-polysans text-15 tracking-[-0.02em] transition-colors ${
                  active
                    ? "text-graphite"
                    : "text-slate hover:text-graphite"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Theme + Auth ─────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Button render={<Link href="/register" />} variant="primary" size="sm" className="hidden sm:inline-flex">
            Get Started
            <ArrowRightIcon className="h-3.5 w-3.5 btn-arrow transition-transform duration-150" />
          </Button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full p-2 text-graphite transition-colors hover:bg-ash md:hidden"
          >
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      {open && (
        <div className="border-t border-mist bg-canvas px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 font-polysans text-15 tracking-[-0.02em] transition-colors ${
                    active
                      ? "bg-ash text-graphite"
                      : "text-slate hover:bg-ash hover:text-graphite"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-mist pt-4">
              <Button render={<Link href="/register" onClick={() => setOpen(false)} />} variant="primary" size="sm" className="w-full">
                Get Started
                <ArrowRightIcon className="h-3.5 w-3.5 btn-arrow transition-transform duration-150" />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
