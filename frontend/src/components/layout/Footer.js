import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "#practice", label: "Practice" },
  { href: "#topics", label: "Topics" },
  { href: "#companies", label: "Companies" },
  { href: "#progress", label: "Progress" },
  { href: "#discussions", label: "Discussions" },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-canvas">
      <div className="mx-auto max-w-[1112px] px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-graphite">
                <span className="font-inter text-[11px] font-semibold leading-none text-canvas">
                  L
                </span>
              </span>
              <span className="font-inter text-[13px] font-medium text-graphite">
                LeetAptitude
              </span>
            </div>
            <p className="mt-3 max-w-[32ch] font-inter text-[12px] leading-relaxed text-slate">
              A focused practice platform for placement aptitude.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2.5">
            {PRODUCT_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-inter text-[12px] text-steel transition-colors hover:text-graphite"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-wrap gap-x-6 gap-y-2.5">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-inter text-[12px] text-slate transition-colors hover:text-graphite"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-mist pt-6">
          <p className="font-inter text-[11px] text-slate">
            © 2026 LeetAptitude
          </p>
          <p className="font-inter text-[11px] text-faint">
            Practice with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
