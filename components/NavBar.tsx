"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  show?: boolean; // 조건부 렌더링용
}

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // 스크롤 시 sticky 네비 적용 (스크롤 50 이상이면 sticky)
  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 로그인/로그아웃 토글 핸들러 (실제 인증 연동은 로그인 화면에서 처리)
  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  // 메뉴 아이템 정의 (필요시 조건 추가)
  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Tax Calculator", href: "/tax-calculator" },
    { label: "About", href: "/about", show: false }, // 숨김 처리 예시
    { label: "Blog", href: "/blog", show: false },
    { label: "Contact", href: "/contact", show: false },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white z-50 shadow-md transition-shadow ${
        isSticky ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-14 md:h-16">
        <h1 className="text-xl font-bold select-none">제이의 포트폴리오</h1>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex space-x-8 text-gray-700 text-base items-center">
          {navItems.map(
            ({ label, href, show = true }) =>
              show && (
                <Link
                  key={href}
                  href={href}
                  className={`hover:text-blue-600 transition-colors ${
                    pathname === href
                      ? "text-blue-700 font-semibold border-b-2 border-blue-600"
                      : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-blue-600 font-semibold hover:underline focus:outline-none"
              type="button"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="text-blue-600 font-semibold hover:underline focus:outline-none"
              type="button"
            >
              로그인
            </button>
          )}
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 토글"
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-4 py-3 space-y-3 text-gray-700 text-base">
            {navItems.map(
              ({ label, href, show = true }) =>
                show && (
                  <Link
                    key={href}
                    href={href}
                    className={`block px-2 py-1 rounded-md hover:bg-gray-100 ${
                      pathname === href
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                )
            )}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-blue-600 font-semibold text-left px-2 py-1 hover:underline focus:outline-none"
                type="button"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLoginClick();
                  setMenuOpen(false);
                }}
                className="text-blue-600 font-semibold text-left px-2 py-1 hover:underline focus:outline-none"
                type="button"
              >
                로그인
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
