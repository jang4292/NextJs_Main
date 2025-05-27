"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const animation = gsap.to(titleRef.current, {
      scale: 1.2,
      duration: 0.6,
      ease: "bounce.out",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section className="py-20 px-4 text-center w-full overflow-x-hidden">
      <h2
        ref={titleRef}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 block"
        style={{ transformOrigin: "center center" }}
      >
        프론트와 백을 자유롭게 오가는 TypeScript 엔지니어
      </h2>

      <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-screen-md mx-auto">
        복잡한 요구사항도 명확하게 구조화하고,
        <br />
        유지보수가 쉬운 코드를 지향합니다.
        <br />
        <br />
        12년 이상의 다양한 개발 경력을 바탕으로,
        <br />
        웹, 데스크탑, 모바일까지 다양한 플랫폼에서
        <br />
        서비스를 개발하고 운영해왔습니다.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <a
          href="/resume.pdf"
          className="w-full sm:w-auto text-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          이력서 보기
        </a>

        <Link
          href="/projects"
          className="w-full sm:w-auto text-center px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
        >
          프로젝트 보기
        </Link>
      </div>
    </section>
  );
}
