import Link from "next/link";
import type { Metadata } from "next";
import { IdiomCard } from "@/features/idiom/components/IdiomCard";
import { idioms } from "@/features/idiom/data/idioms";

export const metadata: Metadata = {
  title: "사자성어 학습",
  description:
    "사자성어의 뜻과 사용 예문을 쉽게 확인할 수 있는 학습 페이지입니다.",
};

export default function IdiomsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:pb-8">
      <Link
        href="/projects"
        className="mb-6 inline-block rounded-md text-sm text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        Projects로 돌아가기
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">사자성어 학습</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
          일상과 업무에서 활용할 수 있는 사자성어의 뜻과 예문을 확인합니다.
        </p>
      </header>

      <section aria-label="사자성어 목록">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {idioms.map((idiom) => (
            <IdiomCard key={idiom.id} idiom={idiom} />
          ))}
        </div>
      </section>
    </div>
  );
}
