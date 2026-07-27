import type { ReactNode } from "react";

export function PageShell({
  children,
  className = "",
  size = "wide",
}: {
  children: ReactNode;
  className?: string;
  size?: "narrow" | "content" | "wide";
}) {
  const maxWidth = {
    narrow: "max-w-3xl",
    content: "max-w-5xl",
    wide: "max-w-7xl",
  }[size];

  return (
    <div
      className={`mx-auto w-full ${maxWidth} px-4 py-8 pb-24 md:pb-10 ${className}`}
    >
      {children}
    </div>
  );
}
