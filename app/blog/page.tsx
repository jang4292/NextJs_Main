import Link from "next/link";
import { Metadata } from "next";
import { getSortedPosts } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "YH Jang | Blog",
  description: "개발 보고서 및 프로젝트 기록",
};

export default function BlogPage() {
  const posts = getSortedPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">개발 블로그</h1>
      <p className="mb-8 text-sm text-gray-500">
        프로젝트 개발 보고서 및 기술 기록
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-lg border border-gray-200 p-6 transition-all hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {post.titleKo}
                  </h2>
                  <p className="mb-2 text-sm text-gray-400">{post.title}</p>
                </Link>
                <p className="text-sm leading-relaxed text-gray-600">
                  {post.summaryKo}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <time className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{post.author}</span>
              <span className="text-gray-300">·</span>
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block text-xs text-blue-600 hover:underline"
            >
              자세히 보기 →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
