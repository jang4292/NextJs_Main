import type { ReactNode } from "react";

export function ContentCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-md border border-neutral-200 bg-white p-5 ${className}`}
    >
      {children}
    </section>
  );
}
