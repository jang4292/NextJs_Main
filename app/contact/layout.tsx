import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "문의 메일 전송 및 연락 페이지",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
