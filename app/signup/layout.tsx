import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "회원가입 페이지",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
