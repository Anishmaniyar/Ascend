import {
  FootprintIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  CrownIcon,
  LockIcon,
} from "@/components/ui/icons";

const ICON_MAP = {
  FootprintIcon,
  TargetIcon,
  ZapIcon,
  BrainIcon,
  FlameIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  CrownIcon,
};

/**
 * BadgeCard — displays a single badge with earned/locked visual treatment.
 *
 * @param {object}  badge     — { id, name, description, icon, earned, earnedAt, requirement }
 * @param {string}  size      — "sm" (dashboard 3-up) or "lg" (badges page)
 */
export default function BadgeCard({ badge, size = "sm" }) {
  const { name, description, icon, earned, earnedAt, requirement } = badge;
  const Icon = ICON_MAP[icon] ?? TargetIcon;

  if (size === "lg") {
    return (
      <div
        className={`group flex flex-col items-center rounded-2xl p-6 text-center transition-colors ${
          earned
            ? "bg-ash"
            : "bg-fog opacity-60"
        }`}
      >
        {/* Icon */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            earned ? "bg-ember/10" : "bg-mist"
          }`}
        >
          {earned ? (
            <Icon className="h-7 w-7 text-ember" />
          ) : (
            <div className="relative">
              <Icon className="h-7 w-7 text-slate" />
              <LockIcon className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-slate" />
            </div>
          )}
        </div>

        {/* Name */}
        <p className="mt-3 font-polysans text-subheading tracking-[-0.02em] text-graphite">
          {name}
        </p>

        {/* Description */}
        <p className="mt-1 text-13 leading-[1.4] text-steel">{description}</p>

        {/* State */}
        {earned ? (
          <span className="mt-3 inline-flex items-center gap-1 rounded-tags bg-ember/10 px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-ember">
            EARNED
          </span>
        ) : (
          <span className="mt-3 inline-flex items-center gap-1 rounded-tags bg-mist px-3 py-1 font-polysans text-13 tracking-[-0.02em] text-slate">
            LOCKED
          </span>
        )}

        {/* Earned date or requirement */}
        {earned && earnedAt ? (
          <p className="mt-2 text-13 text-slate">{earnedAt}</p>
        ) : !earned && requirement ? (
          <p className="mt-2 text-13 text-slate">{requirement}</p>
        ) : null}
      </div>
    );
  }

  // Small card — used on dashboard (3-up)
  return (
    <div
      className={`flex flex-col items-center rounded-2xl p-5 text-center transition-colors ${
        earned ? "bg-ash" : "bg-fog opacity-60"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          earned ? "bg-ember/10" : "bg-mist"
        }`}
      >
        {earned ? (
          <Icon className="h-6 w-6 text-ember" />
        ) : (
          <div className="relative">
            <Icon className="h-6 w-6 text-slate" />
            <LockIcon className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-slate" />
          </div>
        )}
      </div>

      {/* Name */}
      <p className="mt-2.5 font-polysans text-15 tracking-[-0.02em] text-graphite">
        {name}
      </p>

      {/* Description — truncated */}
      <p className="mt-1 line-clamp-2 text-13 leading-[1.4] text-steel">
        {description}
      </p>

      {/* State badge */}
      {earned ? (
        <span className="mt-2.5 inline-flex items-center rounded-tags bg-ember/10 px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] text-ember">
          EARNED
        </span>
      ) : (
        <span className="mt-2.5 inline-flex items-center rounded-tags bg-mist px-2.5 py-0.5 font-polysans text-13 tracking-[-0.02em] text-slate">
          LOCKED
        </span>
      )}
    </div>
  );
}
