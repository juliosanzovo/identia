import { ReactNode } from "react";

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`panel-surface panel-hover-glow p-4 ${className}`}
    >
      {title && (
        <h3 className="mb-3 font-display text-sm font-medium tracking-wide text-paper">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export function MonoField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-slate">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm text-paper">{value ?? "—"}</dd>
    </div>
  );
}
