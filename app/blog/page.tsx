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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">개발 블로그</h1>
      <p className="text-gray-500 mb-8 text-sm">프로젝트 개발 보고서 및 기술 기록</p>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {post.titleKo}
                  </h2>
                  <p className="text-sm text-gray-400 mb-2">{post.title}</p>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">{post.summaryKo}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
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
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-block mt-3 text-xs text-blue-600 hover:underline"
            >
              자세히 보기 →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
