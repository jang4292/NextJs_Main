"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music, FolderKanban, User, Mail } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Music", href: "/music-list", icon: Music },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: Mail },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow md:hidden">
      <ul className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="text-center">
              <Link
                href={item.href}
                className={clsx(
                  "flex flex-col items-center",
                  isActive ? "text-lx text-blue-600" : "text-sm text-gray-600",
                )}
              >
                <Icon className="mb-0.5 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
