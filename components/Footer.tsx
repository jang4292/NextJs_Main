"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-gray-100 text-gray-700 border-t">
      <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-[1fr_2fr] gap-6 text-sm">
        <div>
          <p className="font-bold text-2xl">제이의 포트폴리오</p>

          {/* 
          방문자 수 
          실제 사용시 API 연동 또는 외부 방문자 카운터 삽입 필요
          */}
          <div className="mt-4 text-left space-y-2">
            <div className="space-y-1 text-gray-600">
              <p>
                <span className="font-semibold"> Today : </span>
                <span className="font-medium">0</span>
              </p>
              <p>
                <span className="font-semibold">Total : </span>
                <span className="font-medium">0</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            &copy; {new Date().getFullYear()} 제이. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Image
              src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=white"
              alt="JavaScript"
              width={120}
              height={28}
            />
            <Image
              src="https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white"
              alt="Html5"
              width={90}
              height={28}
            />
            <Image
              src="https://img.shields.io/badge/Cocos%20Creator-blue.svg?style=for-the-badge&logo=cocos&logoColor=white"
              alt="CocosCreator"
              width={120}
              height={28}
            />
            <Image
              src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white"
              alt="Next.js"
              width={90}
              height={28}
            />
            <Image
              src="https://img.shields.io/badge/TailwindCSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"
              alt="TailwindCSS"
              width={120}
              height={28}
            />
            <Image
              src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white"
              alt="TypeScript"
              width={110}
              height={28}
            />
            <Image
              src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white"
              alt="Node.js"
              width={100}
              height={28}
            />
          </div>
          <div className="flex space-x-4">
            <Link href="https://github.com/jang4292" target="_blank">
              <Image
                src="/icons/github.svg"
                alt="GitHub"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://www.youtube.com/@yunhwanjang8974"
              target="_blank"
            >
              <Image
                src="/icons/youtube.svg"
                alt="YouTube"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://www.linkedin.com/in/yunhwan-jang-7167b3119/"
              target="_blank"
            >
              <Image
                src="/icons/linkedin.svg"
                alt="LinkedIn"
                width={24}
                height={24}
              />
            </Link>
            <Link href="https://blog.naver.com/janghyunki17" target="_blank">
              <Image
                src="/icons/NaverBlog.svg"
                alt="LinkedIn"
                width={24}
                height={24}
              />
            </Link>
            <Link href="/contact" aria-label="Contact">
              <ExternalLink className="w-6 h-6 hover:text-blue-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
