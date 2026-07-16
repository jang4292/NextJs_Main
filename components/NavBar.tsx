"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopNav = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music-list" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16">
        <Link
          href="/"
          className="text-lg font-bold transition-colors hover:text-blue-600 md:text-xl"
        >
          제이의 포트폴리오
        </Link>

        <nav className="hidden items-center gap-6 text-base text-gray-700 md:flex">
          {desktopNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "transition-colors hover:text-blue-600",
                pathname === item.href &&
                  "border-b-2 border-blue-600 font-semibold text-blue-700",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
