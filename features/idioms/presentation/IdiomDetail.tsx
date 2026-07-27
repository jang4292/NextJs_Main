import type { Idiom } from "@/features/idioms/types/idiom.types";

export function IdiomDetail({ idiom }: { idiom: Idiom }) {
  return (
    <article>
      <header className="mb-6 rounded-md border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-emerald-700">사자성어</p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-950">
          {idiom.title}
        </h1>
        <p className="mt-2 text-lg text-neutral-500">{idiom.hanja}</p>
        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          {idiom.summary}
        </p>
      </header>

      <div className="space-y-4">
        <section className="rounded-md border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-950">상세 설명</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {idiom.description}
          </p>
        </section>
        <section className="rounded-md border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-950">사용 예문</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {idiom.example}
          </p>
        </section>
        <section className="rounded-md border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-950">카테고리</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {idiom.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
              >
                {category}
              </span>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
