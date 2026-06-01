"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const desktopNav = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music-list" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-14 md:h-16">
        <Link href="/" className="text-lg md:text-xl font-bold hover:text-blue-600 transition-colors">
          제이의 포트폴리오
        </Link>

        <nav className="hidden md:flex gap-6 text-base text-gray-700 items-center">
          {desktopNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "hover:text-blue-600 transition-colors",
                pathname === item.href &&
                  "text-blue-700 font-semibold border-b-2 border-blue-600"
              )}
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-3 ml-4">
              <Link
                href="/profile"
                className={clsx(
                  "text-sm text-gray-600 hover:text-blue-600 transition-colors",
                  pathname === "/profile" && "text-blue-700 font-semibold"
                )}
              >
                {user?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              <Link
                href="/login"
                className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 text-sm border border-gray-300 hover:border-blue-400 rounded-md transition-colors"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
