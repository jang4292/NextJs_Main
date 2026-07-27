import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { idioms } from "@/features/idioms/data/idioms";
import { IdiomDetail } from "@/features/idioms/presentation/IdiomDetail";
import { getIdiomBySlug } from "@/features/idioms/utils/getIdiomBySlug";

export function generateStaticParams() {
  return idioms.map((idiom) => ({ slug: idiom.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idiom = getIdiomBySlug(slug);

  if (!idiom) {
    return { title: "사자성어를 찾을 수 없습니다" };
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
    <PageShell size="narrow">
      <Link
        href="/learn/idioms"
        className="mb-6 inline-block rounded text-sm font-medium text-emerald-700 hover:underline"
      >
        Back to idioms
      </Link>
      <IdiomDetail idiom={idiom} />
    </PageShell>
  );
}
