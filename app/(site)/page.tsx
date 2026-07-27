import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { LinkCard } from "@/components/cards/LinkCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { getFeaturedLearningItems } from "@/features/learning/catalog";
import { getFeaturedTools, toolCatalog } from "@/features/tools/catalog";
import { learningCatalog } from "@/features/learning/catalog";

export const metadata: Metadata = {
  title: "Interactive Lab",
  description: "도구와 학습 콘텐츠를 바로 실행하는 YH Jang Interactive Lab",
};

export default function HomePage() {
  const recentlyUpdated = [...toolCatalog, ...learningCatalog]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  return (
    <PageShell>
      <section className="mb-10 border-b border-neutral-200 pb-8">
        <p className="text-sm font-semibold text-emerald-700">
          Tools + Learning
        </p>
        <h1 className="mt-2 max-w-4xl text-4xl font-bold text-neutral-950 md:text-5xl">
          바로 써보고, 읽고, 개선하는 Interactive Lab
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600">
          음악 스튜디오, 미니게임, 계산기, 개발 기록과 학습 콘텐츠를 한 흐름으로
          정리했습니다. 포트폴리오는 이 작업들의 맥락을 보강하는 보조 영역으로
          배치했습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            Open Tools
          </Link>
          <Link
            href="/learn"
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900"
          >
            Explore Learning
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader
          eyebrow="Featured Tools"
          title="실행 가능한 도구"
          description="음악, 게임, 계산처럼 바로 사용할 수 있는 기능을 먼저 배치했습니다."
        />
        <ContentGrid>
          {getFeaturedTools().map((tool) => (
            <FeatureCard
              key={tool.id}
              eyebrow={tool.eyebrow}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              cta="Launch"
            />
          ))}
        </ContentGrid>
      </section>

      <section className="mb-10">
        <SectionHeader
          eyebrow="Learning"
          title="학습과 기록"
          description="개발 블로그와 언어 학습 콘텐츠를 별도 허브로 묶었습니다."
        />
        <ContentGrid>
          {getFeaturedLearningItems().map((item) => (
            <FeatureCard
              key={item.id}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
              href={item.href}
              cta="Browse"
            />
          ))}
        </ContentGrid>
      </section>

      <section className="mb-10">
        <SectionHeader
          eyebrow="Recently Updated"
          title="최근 정리한 영역"
          description="새 구조의 canonical route 기준으로 업데이트 항목을 보여줍니다."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {recentlyUpdated.map((item) => (
            <LinkCard
              key={item.href}
              href={item.href}
              title={item.title}
              description={`${item.updatedAt} · ${item.description}`}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Profile Snapshot"
          title="YH Jang"
          description="TypeScript, Next.js, 서비스 구조화에 집중하는 엔지니어입니다."
          action={
            <Link
              href="/about"
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900"
            >
              About
            </Link>
          }
        />
      </section>
    </PageShell>
  );
}
