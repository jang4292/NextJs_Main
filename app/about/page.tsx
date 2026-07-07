import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "사이트와 운영자에 대한 소개 페이지",
};

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1>About Us</h1>
    </div>
  );
}
