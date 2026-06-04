import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "내 계정 정보 및 회원 설정 페이지",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
