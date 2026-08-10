import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  ARITHMETIC_LEARNING_HREF,
  mathSubjectCatalog,
  type MathSubjectItem,
} from "@/features/math-learning/catalog";

export const metadata: Metadata = {
  title: "Math Learning",
  description: "사칙연산에서 시작해 수학 학습 영역으로 확장하는 학습 허브",
};

const roadmap = [
  "사칙연산 Basic 안정화",
  "수열 Basic 완료",
  "Statistics Basic 완료",
  "Probability Basic 완료",
  "음수·분수·소수 준비",
];

export default function MathLearningPage() {
  return (
    <PageShell size="wide">
      <SectionHeader
        eyebrow="Math Learning"
        title="수학 학습"
        description="지금은 수와 연산, 수열, 통계, 확률 기초를 중심으로 학습하고, 이후 수 체계와 함수·기하로 차례로 확장합니다."
        action={
          <Link
            href={ARITHMETIC_LEARNING_HREF}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            연산 학습 시작
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <section aria-labelledby="math-subjects-heading">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              학습 영역
            </p>
            <h2
              id="math-subjects-heading"
              className="mt-1 text-2xl font-bold text-neutral-950"
            >
              Curriculum Domains
            </h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {mathSubjectCatalog.map((subject) => (
            <MathSubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="math-roadmap-heading"
        className="mt-8 border-t border-neutral-200 pt-6"
      >
        <p className="text-sm font-semibold text-emerald-700">다음 확장 순서</p>
        <h2
          id="math-roadmap-heading"
          className="mt-1 text-2xl font-bold text-neutral-950"
        >
          Arithmetic First, Then Number System
        </h2>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {roadmap.map((item, index) => (
            <li
              key={item}
              className="rounded-md border border-neutral-200 bg-white p-4"
            >
              <p className="text-xs font-semibold text-neutral-500">
                Phase {index + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {item}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}

function MathSubjectCard({ subject }: { subject: MathSubjectItem }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-700 uppercase">
            {subject.eyebrow}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-neutral-950">
            {subject.title}
          </h3>
        </div>
        <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-700">
          {subject.statusLabel}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        {subject.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {subject.topics.map((topic) => (
          <span
            key={topic}
            className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700"
          >
            {topic}
          </span>
        ))}
      </div>
    </>
  );

  if (subject.href) {
    return (
      <Link
        href={subject.href}
        className="group flex min-h-[240px] flex-col rounded-md border border-emerald-200 bg-white p-5 transition-colors hover:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
      >
        <div className="flex-1">{content}</div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 group-hover:underline">
          학습으로 이동
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="flex min-h-[240px] flex-col rounded-md border border-neutral-200 bg-neutral-50 p-5 text-neutral-500"
    >
      <div className="flex-1">{content}</div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500">
        <Lock className="h-4 w-4" aria-hidden="true" />
        준비 중
      </span>
    </div>
  );
}
