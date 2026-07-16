"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import type gsap from "gsap";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let animation: gsap.core.Tween | undefined;
    let cancelled = false;

    // gsap is only needed for this post-mount animation, so load it lazily
    // instead of bundling it into the initial page JS.
    import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      animation = gsap.to(titleRef.current, {
        scale: 1.2,
        duration: 0.6,
        ease: "bounce.out",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center center",
      });
    });

    return () => {
      cancelled = true;
      animation?.kill();
    };
  }, []);

  return (
    <section className="w-full overflow-x-hidden px-4 py-20 text-center">
      <h2
        ref={titleRef}
        className="mb-6 block text-2xl font-bold sm:text-3xl md:text-4xl"
        style={{ transformOrigin: "center center" }}
      >
        프론트와 백을 자유롭게 오가는 TypeScript 엔지니어
      </h2>

      <p className="mx-auto max-w-screen-md text-base leading-relaxed text-gray-700 sm:text-lg">
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

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/resume.pdf"
          className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center text-white transition hover:bg-blue-700 sm:w-auto"
        >
          이력서 보기
        </a>

        <Link
          href="/projects"
          className="w-full rounded-xl border border-blue-600 px-6 py-3 text-center text-blue-600 transition hover:bg-blue-50 sm:w-auto"
        >
          프로젝트 보기
        </Link>
      </div>
    </section>
  );
}
