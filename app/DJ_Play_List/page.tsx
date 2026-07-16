import { Metadata } from "next";
import DJPlayListClient from "./DJPlayListClient";

export const metadata: Metadata = {
  title: "DJ Play List",
  description: "DJ 플레이리스트 재생 및 트랙 관리 페이지",
};

export default function DJPlayListPage() {
  return <DJPlayListClient />;
}
