import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const techBadges = [
  {
    alt: "JavaScript",
    src: "https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=white",
    width: 120,
  },
  {
    alt: "HTML5",
    src: "https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white",
    width: 90,
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
    alt: "TypeScript",
    src: "https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white",
    width: 110,
  },
  {
    alt: "Node.js",
    src: "https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white",
    width: 100,
  },
];

export function Footer() {
  return (
    <footer className="hidden border-t bg-neutral-100 text-neutral-700 md:block">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_2fr] gap-6 px-4 py-5 text-sm">
        <div>
          <p className="text-xl font-bold text-neutral-950">
            YH Interactive Lab
          </p>
          <div className="mt-4 text-left">
            {/* eslint-disable-next-line @next/next/no-img-element -- external live badge, must not go through next/image optimization/caching */}
            <img
              src="https://visitor-badge.laobi.icu/badge?page_id=jang4292.NextJs_Main&left_text=Visitors"
              alt="방문자 수"
              height={20}
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="mt-4 text-neutral-500">
            &copy; {new Date().getFullYear()} YH Jang. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {techBadges.map((badge) => (
              <Image
                key={badge.alt}
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={28}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/jang4292"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/GitHub.svg"
                alt="GitHub"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://www.youtube.com/@yunhwanjang8974"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/YouTube.svg"
                alt="YouTube"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://www.linkedin.com/in/yunhwan-jang-7167b3119/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/LinkedIn.svg"
                alt="LinkedIn"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://blog.naver.com/janghyunki17"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/NaverBlog.svg"
                alt="Naver Blog"
                width={24}
                height={24}
              />
            </Link>
            <Link href="/contact" aria-label="Contact">
              <ExternalLink className="h-6 w-6 transition-colors hover:text-emerald-700" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
