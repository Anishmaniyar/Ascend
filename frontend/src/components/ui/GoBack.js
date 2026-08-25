"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/ui/icons";

/**
 * GoBack — a back navigation button with left arrow.
 * Uses router.back() by default, or navigates to a specific href.
 *
 * @param {object} props
 * @param {string}  props.href     — optional: navigate to a specific route instead of going back
 * @param {string}  props.label    — button text (default: "Go back")
 * @param {string}  props.className— additional classes
 */
export default function GoBack({ href, label = "Go back", className = "" }) {
  const router = useRouter();

  function handleClick(e) {
    if (href) return; // let <Link> handle it
    e.preventDefault();
    router.back();
  }

  return (
    <a
      href={href || "#"}
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-[13px] text-slate transition-colors hover:text-graphite ${className}`}
    >
      <ArrowLeftIcon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
