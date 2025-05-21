"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const animation = gsap.to(titleRef.current, {
      scale: 1.1,
      duration: 0.6,
      ease: "bounce.out",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });

    return () => {
      animation.kill(); // cleanup 함수는 void 반환
    };
  }, []);

  return (
    <section className="py-24 text-center">
      <h2
        ref={titleRef}
        className="text-5xl font-bold mb-4 inline-block"
        style={{ transformOrigin: "center center" }}
      >
        안녕하세요, 제이입니다.
      </h2>

      <br />

      <p className="text-2xl text-gray-1200 dark:text-gray-300 max-w-2xl mx-auto">
        12년 경력의 풀스택 개발자이자 슬롯 게임 전문가입니다.
      </p>

      <br />

      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        다양한 플랫폼에서 서비스와 게임을 개발하고 운영한 경험이 있습니다.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/resume.pdf"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          이력서 보기
        </a>

        <Link
          href="/Projects"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50"
        >
          프로젝트 보기
        </Link>
      </div>
    </section>
  );
}
