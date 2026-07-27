import "@/styles/globals.css";

import { getSiteUrl } from "@/lib/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
      <body className="bg-background text-foreground min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
