import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { idioms } from "@/features/idiom/data/idioms";
import { getIdiomBySlug } from "@/features/idiom/utils/getIdiomBySlug";

export function generateStaticParams() {
  return idioms.map((idiom) => ({
    slug: idiom.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idiom = getIdiomBySlug(slug);

  if (!idiom) {
    return {
      title: "사자성어를 찾을 수 없습니다",
    };
  }

  return {
    title: `${idiom.title} 뜻과 예문`,
    description: idiom.summary,
  };
}

export default async function IdiomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idiom = getIdiomBySlug(slug);

  if (!idiom) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-24 md:pb-8">
      <Link
        href="/projects/idioms"
        className="mb-6 inline-block rounded-md text-sm text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        목록으로 돌아가기
      </Link>

      <article>
        <header className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <p className="mb-2 text-sm font-medium text-blue-600">사자성어</p>
          <h1 className="text-3xl font-bold text-gray-900">{idiom.title}</h1>
          <p className="mt-2 text-lg text-gray-500">{idiom.hanja}</p>
          <p className="mt-6 text-base leading-relaxed text-gray-700">
            {idiom.summary}
          </p>
        </header>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">상세 설명</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {idiom.description}
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">사용 예문</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {idiom.example}
            </p>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">카테고리</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {idiom.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                >
                  {category}
                </span>
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
