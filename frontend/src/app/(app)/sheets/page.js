import Link from "next/link";
import { ArrowRightIcon, ClockIcon, LayersIcon } from "@/components/ui/icons";
import { companies } from "@/lib/mock/landing";

export default function SheetsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max-width)] px-6 py-10">
      <header>
        <h1 className="text-heading-lg text-graphite">Company Sheets</h1>
        <p className="mt-2 max-w-[56ch] text-15 leading-[1.5] text-steel">
          Practice curated question sets modeled on real placement tests.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <article
            key={company.id}
            className="group flex flex-col rounded-2xl bg-ash p-6 transition-colors hover:bg-fog"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-canvas font-polysans text-subheading tracking-[-0.02em] text-graphite">
                {company.initial}
              </span>
              <span className="rounded-tags bg-canvas px-2.5 py-1 text-13 text-brass">
                {company.difficulty}
              </span>
            </div>
            <p className="mt-5 font-polysans text-subheading tracking-[-0.02em] text-graphite">
              {company.name}
            </p>
            <p className="mt-2 flex-1 text-13 leading-[1.5] text-steel">
              {company.description}
            </p>
            <div className="mt-5 flex items-center gap-4 text-13 text-slate">
              <span className="flex items-center gap-1.5">
                <LayersIcon className="h-3.5 w-3.5" />
                {company.questions} Q
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5" />
                {company.estimatedTime}
              </span>
            </div>
            {/* TODO: wire to the sheet practice flow */}
            <Link
              href="#"
              className="mt-5 inline-flex items-center gap-1.5 font-polysans text-13 tracking-[-0.02em] text-graphite transition-colors group-hover:text-ember"
            >
              Practice
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
