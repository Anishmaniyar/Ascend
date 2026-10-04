export default function SectionCard({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-cards border border-mist bg-canvas p-6 md:p-7 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-[19px] font-light tracking-[-0.01em] text-graphite">
          {title}
        </h3>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
