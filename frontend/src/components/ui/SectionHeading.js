import { SparklesIcon } from "@/components/ui/icons";

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className = "",
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {kicker && (
        <p className="flex items-center gap-2 font-polysans text-13 tracking-[-0.02em] text-brass">
          <SparklesIcon className="h-3.5 w-3.5" />
          {kicker}
        </p>
      )}
      <h2 className="mt-4 text-heading-lg text-graphite">{title}</h2>
      {description && (
        <p className="mt-4 text-subheading text-steel">{description}</p>
      )}
    </div>
  );
}
