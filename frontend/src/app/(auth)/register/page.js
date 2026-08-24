"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="relative flex w-full flex-col justify-between px-8 py-8 lg:w-[480px] xl:w-[520px] lg:px-12 lg:py-10">
        {/* Logo — top left */}
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="font-polysans text-[15px] tracking-[-0.02em] text-graphite">
            LeetAptitude
          </span>
        </div>

        {/* Signup content — vertically centered */}
        <div className="mx-auto w-full max-w-[320px]">
          <h1 className="font-polysans text-heading tracking-[-0.02em] text-graphite">
            Get started
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-steel">
            Start your aptitude preparation journey.
          </p>

          {/* Google sign up button */}
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            variant="secondary"
            className="mt-8 w-full gap-3 border border-mist bg-canvas hover:border-graphite hover:shadow-sm"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-graphite border-t-transparent" />
            ) : (
              <>
                <GoogleIcon className="h-5 w-5 shrink-0" />
                Get Started with Google
              </>
            )}
          </Button>

          {/* Subtle info line */}
          <p className="mt-6 text-center text-[13px] leading-relaxed text-slate">
            One click to sign up or sign in. Track your practice, progress, and preparation in one place.
          </p>
        </div>

        {/* Copyright — bottom left */}
        <p className="text-[13px] text-slate">&copy; 2026 LeetAptitude</p>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          RIGHT — PRODUCT PREVIEW
          ════════════════════════════════════════════════════════════════ */}
      <div className="hidden flex-1 items-center justify-center overflow-hidden bg-canvas lg:flex">
        <DashboardPreview />
      </div>
    </div>
  );
}
