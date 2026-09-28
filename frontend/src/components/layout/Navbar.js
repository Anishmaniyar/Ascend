"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { MenuIcon, XIcon } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "#practice", label: "Practice" },
  { href: "#topics", label: "Topics" },
  { href: "#companies", label: "Companies" },
  { href: "#progress", label: "Progress" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-graphite">
        <span className="font-inter text-[11px] font-semibold leading-none text-canvas">
          L
        </span>
      </span>
      <span className="font-inter text-[13px] font-medium tracking-[-0.01em] text-graphite">
        LeetAptitude
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-mist bg-canvas"
          : "border-b border-transparent bg-canvas"
      }`}
    >
      <div className="mx-auto flex h-[52px] max-w-[1112px] items-center justify-between gap-4 px-6">
        <Wordmark />

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-inter text-[12px] font-normal text-steel transition-colors hover:text-graphite"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            render={<Link href="/register" />}
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Start Practicing
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-md p-1.5 text-steel transition-colors hover:bg-ash hover:text-graphite md:hidden"
          >
            {open ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-mist bg-canvas px-6 py-3 md:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 font-inter text-[13px] text-steel transition-colors hover:bg-ash hover:text-graphite"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-mist pt-3 pb-1">
              <Button
                render={<Link href="/register" onClick={() => setOpen(false)} />}
                variant="primary"
                size="md"
                className="w-full"
              >
                Start Practicing
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
