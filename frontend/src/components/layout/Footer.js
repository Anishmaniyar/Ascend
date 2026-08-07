import Link from "next/link";
import { GitHubIcon } from "@/components/ui/icons";

const PRODUCT_LINKS = [
  { href: "/topics", label: "Topics" },
  { href: "/sheets", label: "Company Sheets" },
  { href: "/dashboard", label: "Practice" },
  { href: "/discussions", label: "Discussions" },
];

const START_LINKS = [
  { href: "/dashboard", label: "Start Practicing" },
  { href: "/topics", label: "Explore Topics" },
  { href: "/profile", label: "Your Progress" },
];

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-canvas">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 font-polysans text-base tracking-[-0.02em] text-graphite">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-graphite">
                <span className="h-2 w-2 rounded-full bg-ember" />
              </span>
              LeetAptitude
            </Link>
            <p className="mt-4 max-w-[36ch] text-15 leading-[1.5] text-steel">
              Learn. Practice. Improve. Placement-ready — one topic at a time.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="mt-6 inline-flex items-center gap-2 text-13 text-slate transition-colors hover:text-graphite"
            >
              <GitHubIcon className="h-4 w-4" />
              View source on GitHub
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">Product</p>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-15 text-graphite transition-colors hover:text-ember">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-polysans text-13 tracking-[-0.02em] text-slate">Get started</p>
            <ul className="mt-4 space-y-3">
              {START_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-15 text-graphite transition-colors hover:text-ember">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-mist pt-8">
          <p className="font-polysans text-13 tracking-[-0.02em] text-slate">
            © 2026 LeetAptitude
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-polysans text-13 tracking-[-0.02em] text-slate transition-colors hover:text-graphite">
              Cookie preferences
            </a>
            <span className="font-polysans text-13 tracking-[-0.02em] text-slate">
              Made for placement aspirants
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
