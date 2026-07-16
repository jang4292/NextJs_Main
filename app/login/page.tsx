import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "계정 로그인 페이지",
};

export default function LoginPage() {
  return <LoginClient />;
}
