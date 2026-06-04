import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "계정 로그인 페이지",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
