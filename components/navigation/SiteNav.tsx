"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isNavigationItemActive,
  siteNavigation,
} from "@/features/navigation/siteNavigation";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16">
        <Link
          href="/"
          className="text-lg font-bold text-neutral-950 transition-colors hover:text-emerald-700 md:text-xl"
        >
          YH Interactive Lab
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-neutral-700 md:flex">
          {siteNavigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={clsx(
                  "rounded px-2 py-1 transition-colors hover:bg-neutral-100 hover:text-neutral-950",
                  isActive &&
                    "bg-neutral-900 font-semibold text-white hover:bg-neutral-900 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
