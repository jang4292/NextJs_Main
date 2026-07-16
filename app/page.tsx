import Hero from "../components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "YH Jang 포트폴리오 메인 페이지",
};

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Hero></Hero>
    </div>
  );
}
