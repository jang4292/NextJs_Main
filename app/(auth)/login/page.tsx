import { Metadata } from "next";
import { LoginForm } from "@/features/auth/presentation/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "계정 로그인 페이지",
};

export default function LoginPage() {
  return <LoginForm />;
}
