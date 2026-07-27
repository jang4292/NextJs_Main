import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { getSortedPosts } from "@/features/blog";
import { BlogList } from "@/features/blog/presentation/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description: "개발 보고서 및 프로젝트 기록",
};

export default function BlogPage() {
  return (
    <PageShell size="content">
      <SectionHeader
        eyebrow="Blog"
        title="개발 블로그"
        description="프로젝트 개발 보고서와 구조 개선 기록을 최신순으로 정리했습니다."
      />
      <BlogList posts={getSortedPosts()} />
    </PageShell>
  );
}
