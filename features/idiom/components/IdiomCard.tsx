import Link from "next/link";
import type { Idiom } from "@/features/idiom/types/idiom.types";

interface IdiomCardProps {
  idiom: Idiom;
}

export function IdiomCard({ idiom }: IdiomCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-sm">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{idiom.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{idiom.hanja}</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          {idiom.summary}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {idiom.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
          >
            {category}
          </span>
        ))}
      </div>

      <Link
        href={`/projects/idioms/${idiom.slug}`}
        className="mt-5 inline-flex w-fit rounded-md text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        {idiom.title} 자세히 보기
      </Link>
    </article>
  );
}
