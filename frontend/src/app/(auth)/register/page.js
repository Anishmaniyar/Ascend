"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

// Google SVG icon
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
    // Simulate Google OAuth — in production, redirect to Google OAuth
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <div className="rounded-2xl border border-mist bg-canvas p-8">
      {/* Heading */}
      <div className="text-center">
        <h1 className="font-polysans text-heading tracking-[-0.02em] text-graphite">
          Create your account
        </h1>
        <p className="mt-2 text-15 text-steel">
          Start your aptitude preparation journey
        </p>
      </div>

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-buttons border border-mist bg-canvas px-5 py-3 font-polysans text-15 tracking-[-0.02em] text-graphite transition-all hover:border-graphite hover:shadow-sm disabled:opacity-60"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-graphite border-t-transparent" />
        ) : (
          <>
            <GoogleIcon className="h-5 w-5" />
            Sign up with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-mist" />
        </div>
        <div className="relative flex justify-center text-13">
          <span className="bg-canvas px-3 text-slate">or</span>
        </div>
      </div>

      {/* Email sign up */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => router.push("/dashboard"), 800);
        }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-13 font-polysans text-steel"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="mt-1.5 h-10 w-full rounded-lg border border-mist bg-canvas px-3 text-15 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-13 font-polysans text-steel"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="mt-1.5 h-10 w-full rounded-lg border border-mist bg-canvas px-3 text-15 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-13 font-polysans text-steel"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="mt-1.5 h-10 w-full rounded-lg border border-mist bg-canvas px-3 text-15 text-graphite placeholder:text-slate focus:border-graphite focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-buttons bg-graphite px-5 py-3 font-polysans text-15 tracking-[-0.02em] text-inverse transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-inverse border-t-transparent" />
          ) : (
            <>
              Create Account
              <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Sign in link */}
      <p className="mt-6 text-center text-15 text-steel">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-polysans text-graphite underline underline-offset-2 hover:text-ember"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
