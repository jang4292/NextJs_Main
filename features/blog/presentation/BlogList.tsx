import Link from "next/link";
import type { BlogPost } from "@/features/blog";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="rounded-md border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-900"
        >
          <Link href={`/learn/blog/${post.slug}`} className="group">
            <h2 className="text-lg font-semibold text-neutral-950 group-hover:underline">
              {post.titleKo}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">{post.title}</p>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {post.summaryKo}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <time>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{post.author}</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
