"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import DashboardPreview from "@/components/auth/DashboardPreview";
import Button from "@/components/ui/Button";

/* ── Google SVG icon ──────────────────────────────────────────────────── */
function GoogleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleGoogleSignUp() {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <div className="flex min-h-screen">
      {/* ════════════════════════════════════════════════════════════════
          LEFT — SIGN UP AREA
          ════════════════════════════════════════════════════════════════ */}
      <div className="relative flex w-full flex-col items-center justify-center px-8 py-12 lg:w-[480px] xl:w-[520px] lg:px-12">
        {/* Logo — top left */}
        <div className="absolute left-8 top-8 flex items-center gap-2.5 lg:left-12 lg:top-10">
          <Logo className="h-7 w-7" />
          <span className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">
            LeetAptitude
          </span>
        </div>

        {/* Go back link — below logo */}
        <Link
          href="/"
          className="absolute left-8 top-[100px] flex items-center gap-1.5 text-[13px] text-slate transition-colors hover:text-graphite lg:left-12 lg:top-[108px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Go back
        </Link>

        {/* Signup content — centered */}
        <div className="w-full max-w-[320px]">
          <h1 className="font-polysans text-[36px] leading-[1.1] tracking-[-0.02em] text-graphite">
            Get started
          </h1>
          <p className="mt-3 text-[14px] leading-[1.5] text-steel">
            Start your aptitude preparation journey.
          </p>

          {/* Google sign up button */}
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            variant="secondary"
            className="mt-8 w-full gap-3 border border-mist bg-canvas py-2.5 text-[14px] hover:border-graphite hover:shadow-sm"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-graphite border-t-transparent" />
            ) : (
              <>
                <GoogleIcon className="h-4 w-4 shrink-0" />
                Get Started with Google
              </>
            )}
          </Button>

          {/* Subtle info line — left aligned */}
          <p className="mt-5 text-[12px] leading-[1.5] text-slate">
            One click to sign up or sign in. Track your practice, progress, and preparation in one place.
          </p>
        </div>

        {/* Copyright — bottom center */}
        <p className="absolute bottom-8 left-0 right-0 text-center text-[12px] text-slate lg:bottom-10">
          &copy; 2026 LeetAptitude
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          RIGHT — PRODUCT PREVIEW
          ════════════════════════════════════════════════════════════════ */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-canvas lg:flex">
        <DashboardPreview />
        {/* Bottom fade to canvas */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-canvas))",
          }}
        />
      </div>
    </div>
  );
}
