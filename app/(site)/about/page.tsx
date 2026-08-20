import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Mail } from "lucide-react";
import { LinkCard } from "@/components/cards/LinkCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";

export const metadata: Metadata = {
  title: "Profile",
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
    <PageShell size="content">
      <SectionHeader
        eyebrow="Profile"
        title="YH Jang"
        description="프론트와 백을 자유롭게 오가며, 복잡한 요구사항을 명확한 구조와 유지보수 가능한 코드로 정리하는 TypeScript 엔지니어입니다."
        action={
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:outline-none"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact
          </Link>
        }
      />

      <section className="mb-10 rounded-md border border-neutral-200 bg-white p-5">
        <p className="text-sm font-semibold text-emerald-700 uppercase">
          TypeScript Engineer
        </p>
        <p className="mt-3 text-base leading-relaxed text-neutral-700">
          12년 이상의 다양한 개발 경력을 바탕으로 웹, 데스크탑, 모바일
          플랫폼에서 서비스를 개발하고 운영해왔습니다. 이 사이트의 도구와 학습
          콘텐츠는 구현 방식과 제품 감각을 함께 보여주는 작업물입니다.
        </p>
      </section>

      <section className="mb-10" aria-labelledby="profile-stack-heading">
        <h2
          id="profile-stack-heading"
          className="mb-4 text-xl font-bold text-neutral-950"
        >
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2 rounded-md border border-neutral-200 bg-white p-5">
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

      <section aria-labelledby="profile-links-heading">
        <h2
          id="profile-links-heading"
          className="mb-4 text-xl font-bold text-neutral-950"
        >
          Links
        </h2>
        <ContentGrid columns="two">
          {SOCIAL_LINKS.map((link) => (
            <LinkCard
              key={link.href}
              href={link.href}
              title={link.label}
              description="External profile"
              external
            />
          ))}
          <LinkCard
            href="/contact"
            title="Contact"
            description="Email contact form"
          />
        </ContentGrid>
      </section>
    </PageShell>
  );
}
