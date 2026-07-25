import { Metadata } from "next";
import FreecellClient from "./FreecellClient";

export const metadata: Metadata = {
  title: "FreeCell",
  description: "카드 한 벌로 즐기는 프리셀",
};

export default function FreecellPage() {
  return <FreecellClient />;
}
