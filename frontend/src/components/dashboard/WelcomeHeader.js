"use client";

import { useEffect, useState } from "react";
import { FlameIcon } from "@/components/ui/icons";
import { user, dailyGoal } from "@/lib/mock/dashboard";

export default function WelcomeHeader() {
  const [greeting, setGreeting] = useState("Hello");
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
    setDateLabel(
      now.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" }),
    );
  }, []);

  const pct = Math.round((dailyGoal.done / dailyGoal.target) * 100);

  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        {/* Filled in after mount to avoid SSR/client date mismatch */}
        {dateLabel && (
          <p className="font-polysans text-13 tracking-[-0.02em] text-slate">{dateLabel}</p>
        )}
        <h1 className="mt-2 text-heading-lg text-graphite">
          {greeting}, {user.name} 👋
        </h1>
        <p className="mt-2 text-15 leading-[1.5] text-steel">
          Continue preparing for your placements — you&apos;re {pct}% through
          today&apos;s goal.
        </p>
      </div>
      <span className="flex items-center gap-2 rounded-tags bg-ash px-4 py-2 font-polysans text-13 tracking-[-0.02em] text-graphite">
        <FlameIcon className="h-4 w-4 text-ember" />
        {user.streak} day streak
      </span>
    </div>
  );
}
