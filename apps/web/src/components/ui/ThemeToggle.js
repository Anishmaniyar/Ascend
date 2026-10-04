"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle — flips the `.dark` class on <html>, which re-maps every
 * semantic color token in globals.css. Persists the choice to localStorage;
 * the root layout script reads it before first paint (no flash).
 *
 * Renders as a small icon-only button (Sun / Moon).
 */
export default function ThemeToggle({ className = "" }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read the theme applied by the no-FOUC script in layout.js once the
  // component mounts, so the icon always matches the actual theme.
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
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-slate transition-colors hover:bg-ash hover:text-graphite ${className}`}
    >
      {mounted ? (
        dark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        // Prevent layout shift — render a placeholder of the same size
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
