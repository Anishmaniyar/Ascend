import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { companySheets } from "@/lib/mock/dashboard";

export default function CompanySheetsGrid() {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist bg-canvas">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_100px_100px_90px] gap-4 border-b border-mist bg-fog/50 px-5 py-3">
        <span className="text-13 font-polysans text-slate">Sheet</span>
        <span className="text-13 font-polysans text-slate">Company</span>
        <span className="text-13 font-polysans text-slate">Difficulty</span>
        <span className="text-13 font-polysans text-slate">Questions</span>
      </div>

      {/* Table rows */}
      {companySheets.map((sheet) => (
        <Link
          key={sheet.id}
          href="/sheets"
          className="group grid grid-cols-[1fr_100px_100px_90px] items-center gap-4 border-b border-mist px-5 py-4 transition-colors last:border-b-0 hover:bg-fog/30"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ash font-polysans text-13 text-graphite">
              {sheet.initial}
            </span>
            <span className="truncate font-polysans text-15 tracking-[-0.02em] text-graphite">
              {sheet.name}
            </span>
          </div>
          <span className="text-13 text-steel">{sheet.initial}</span>
          <span className="text-13 text-brass">{sheet.difficulty}</span>
          <span className="text-13 text-steel">{sheet.questions}</span>
        </Link>
      ))}
    </div>
  );
}
