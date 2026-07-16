import { Metadata } from "next";
import MusicListClient from "./MusicListClient";

export const metadata: Metadata = {
  title: "Music List",
  description: "날짜별 스윙 재즈 플레이리스트 페이지",
};

export default function MusicListPage() {
  return <MusicListClient />;
}
