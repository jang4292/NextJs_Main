import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-sm font-semibold text-emerald-700 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold text-neutral-950 md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}
