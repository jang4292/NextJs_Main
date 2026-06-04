import Hero from "../components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "YH Jang 포트폴리오 메인 페이지",
};

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Hero></Hero>
    </div>
  );
}
