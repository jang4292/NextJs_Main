import type { ReactNode } from "react";

export function ContentGrid({
  children,
  columns = "three",
}: {
  children: ReactNode;
  columns?: "two" | "three";
}) {
  return (
    <div
      className={
        columns === "two"
          ? "grid gap-4 md:grid-cols-2"
          : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {children}
    </div>
  );
}
