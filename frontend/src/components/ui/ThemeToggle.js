"use client";

import { useEffect, useState } from "react";

/**
 * ThemeToggle — flips the `.dark` class on <html>, which re-maps every
 * semantic color token in globals.css. Persists the choice to localStorage;
 * the root layout script reads it before first paint (no flash).
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read the theme applied by the no-FOUC script in layout.js once the
  // component mounts, so the label always matches the actual theme.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode / storage disabled — theme still applies for this tab */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex min-w-16 items-center justify-center rounded-nav-pills border border-mist bg-fog px-4 py-2 font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:border-graphite hover:text-graphite"
    >
      {mounted && (dark ? "Light" : "Dark")}
    </button>
  );
}
