import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DJ Play List",
  description: "DJ 플레이리스트 재생 및 트랙 관리 페이지",
};

export default function DJPlayListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
