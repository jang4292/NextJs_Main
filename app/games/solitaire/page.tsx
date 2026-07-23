import { Metadata } from "next";
import SolitaireClient from "./SolitaireClient";

export const metadata: Metadata = {
  title: "Solitaire",
  description: "카드 한 벌로 즐기는 클론다이크 솔리테어",
};

export default function SolitairePage() {
  return <SolitaireClient />;
}
