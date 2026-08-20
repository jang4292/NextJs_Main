"use client";

import clsx from "clsx";
import { BookOpen, Home, User, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  bottomNavigation,
  isNavigationItemActive,
  type NavigationKey,
} from "@/features/navigation/siteNavigation";

const iconByKey: Record<NavigationKey, typeof Home> = {
  home: Home,
  tools: Wrench,
  learn: BookOpen,
  profile: User,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white shadow md:hidden">
      <ul className="flex justify-around px-1 py-2">
        {bottomNavigation.map((item) => {
          const Icon = iconByKey[item.key];
          const isActive = isNavigationItemActive(pathname, item);

          return (
            <li key={item.href} className="min-w-0 flex-1 text-center">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "flex flex-col items-center gap-0.5 text-xs font-medium",
                  isActive ? "text-emerald-700" : "text-neutral-500",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
