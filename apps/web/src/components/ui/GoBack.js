"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/ui/icons";

/**
 * GoBack — a back navigation button with left arrow.
 * Uses router.back() by default, or navigates to a specific href.
 */
export default function GoBack({ href, label = "Go back", className = "" }) {
  const router = useRouter();

  function handleClick(e) {
    if (href) return; // let <Link> handle it
    e.preventDefault();
    router.back();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-[13px] text-slate transition-colors hover:text-graphite ${className}`}
    >
      <ArrowLeftIcon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
