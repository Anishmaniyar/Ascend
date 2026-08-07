export default function SectionCard({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-ash p-6 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-polysans text-subheading tracking-[-0.02em] text-graphite">
          {title}
        </h3>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
