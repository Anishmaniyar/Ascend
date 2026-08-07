import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { companySheets } from "@/lib/mock/dashboard";

export default function CompanySheetsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {companySheets.map((sheet) => (
        <Link
          key={sheet.id}
          href="/sheets"
          className="group rounded-2xl bg-ash p-6 transition-colors hover:bg-fog"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas font-polysans text-base tracking-[-0.02em] text-graphite">
              {sheet.initial}
            </span>
            <span className="rounded-tags bg-canvas px-2.5 py-1 text-13 text-brass">
              {sheet.difficulty}
            </span>
          </div>
          <p className="mt-4 font-polysans text-base tracking-[-0.02em] text-graphite">
            {sheet.name}
          </p>
          <p className="mt-1 text-13 text-slate">{sheet.questions} questions</p>
          <span className="mt-4 inline-flex items-center gap-1.5 font-polysans text-13 tracking-[-0.02em] text-graphite transition-colors group-hover:text-ember">
            Practice
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
