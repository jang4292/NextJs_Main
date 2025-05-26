"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopNav = [
  { label: "Home", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT", href: "/about" },
];

export function NavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-14 md:h-16">
        <h1 className="text-lg md:text-xl font-bold">제이의 포트폴리오</h1>

        <nav className="hidden md:flex gap-8 text-base text-gray-700">
          {desktopNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "hover:text-blue-600",
                pathname === item.href &&
                  "text-blue-700 font-semibold border-b-2 border-blue-600"
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
