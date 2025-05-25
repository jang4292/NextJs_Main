"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-14 md:h-16">
        {/* Logo / Brand */}
        <h1 className="text-xl font-bold select-none">제이의 포트폴리오</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-gray-700 text-base items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                `hover:text-blue-600 transition-colors ${
                  pathname === item.href
                    ? "text-blue-700 font-semibold border-b-2 border-blue-600"
                    : ""
                }`
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded text-gray-600 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <Menu className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <ul className="flex flex-col px-4 py-3 space-y-3 text-gray-700 text-base">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    `block px-2 py-1 rounded-md hover:bg-gray-100 ${
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : ""
                    }`
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
