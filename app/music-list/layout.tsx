import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music List",
  description: "날짜별 스윙 재즈 플레이리스트 페이지",
};

export default function MusicListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
