import { BottomNav } from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "YH Jang",
    template: "YH Jang | %s",
  },
  description: "YH Jang의 포트폴리오, 프로젝트, 블로그, 연락 페이지",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "YH Jang",
    description: "YH Jang의 포트폴리오 및 개발 기록",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YH Jang",
    description: "YH Jang의 포트폴리오 및 개발 기록",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <AuthProvider>
          <NavBar />
          <main className="flex-grow overflow-y-auto">{children}</main>
          <Footer />
          <BottomNav /> {/* 모바일 하단 전용 네비게이션 */}
        </AuthProvider>
      </body>
    </html>
  );
}
