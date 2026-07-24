import { Metadata } from "next";
import Game2048Client from "./Game2048Client";

export const metadata: Metadata = {
  title: "2048",
  description: "타일을 합쳐 2048을 만드는 퍼즐 게임",
};

export default function Game2048Page() {
  return <Game2048Client />;
}
