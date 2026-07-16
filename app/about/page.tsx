import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "12년 이상의 경력을 가진 TypeScript 엔지니어, 제이(YH Jang)의 소개 페이지",
};

const TECH_STACK = [
  {
    alt: "TypeScript",
    src: "https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white",
    width: 110,
  },
  {
    alt: "JavaScript",
    src: "https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=white",
    width: 120,
  },
  {
    alt: "Next.js",
    src: "https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white",
    width: 90,
  },
  {
    alt: "TailwindCSS",
    src: "https://img.shields.io/badge/TailwindCSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white",
    width: 120,
  },
  {
    alt: "Node.js",
    src: "https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white",
    width: 100,
  },
  {
    alt: "CocosCreator",
    src: "https://img.shields.io/badge/Cocos%20Creator-blue.svg?style=for-the-badge&logo=cocos&logoColor=white",
    width: 120,
  },
  {
    alt: "Html5",
    src: "https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white",
    width: 90,
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/jang4292" },
  { label: "YouTube", href: "https://www.youtube.com/@yunhwanjang8974" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yunhwan-jang-7167b3119/",
  },
  { label: "네이버 블로그", href: "https://blog.naver.com/janghyunki17" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">About</h1>
      <p className="mb-8 text-gray-500">제이(YH Jang) · TypeScript 엔지니어</p>

      <section className="mb-10">
        <p className="text-base leading-relaxed text-gray-700">
          프론트와 백을 자유롭게 오가는 TypeScript 엔지니어입니다.
          <br />
          복잡한 요구사항도 명확하게 구조화하고, 유지보수가 쉬운 코드를
          지향합니다.
          <br />
          <br />
          12년 이상의 다양한 개발 경력을 바탕으로, 웹 · 데스크탑 · 모바일까지
          <br />
          다양한 플랫폼에서 서비스를 개발하고 운영해왔습니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">기술 스택</h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <Image
              key={tech.alt}
              src={tech.src}
              alt={tech.alt}
              width={tech.width}
              height={28}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">연락 및 링크</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className="text-blue-600 hover:underline">
              이메일로 문의하기
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
