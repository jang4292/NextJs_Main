import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getSortedPosts } from "@/data/blogPosts";

export async function generateStaticParams() {
  return getSortedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `YH Jang | ${post.titleKo}`,
    description: post.summaryKo,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="mb-3 mt-8 text-xl font-bold text-gray-900">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="mb-2 mt-6 text-lg font-semibold text-gray-800">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h4
            key={i}
            className="mb-1 mt-4 text-base font-semibold text-gray-800"
          >
            {line.replace("#### ", "")}
          </h4>
        );
      }
      if (
        line.startsWith("- ✅") ||
        line.startsWith("- ❌") ||
        line.startsWith("- ")
      ) {
        return (
          <li
            key={i}
            className="ml-4 list-disc text-sm leading-relaxed text-gray-700"
          >
            {line.replace(/^- /, "")}
          </li>
        );
      }
      if (line.startsWith("1. ") || /^\d+\. /.test(line)) {
        return (
          <li
            key={i}
            className="ml-4 list-decimal text-sm leading-relaxed text-gray-700"
          >
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      }
      if (line.startsWith("```")) {
        return null;
      }
      if (line.trim() === "") {
        return <br key={i} />;
      }
      return (
        <p key={i} className="text-sm leading-relaxed text-gray-700">
          {line}
        </p>
      );
    })
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← 블로그 목록으로
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">
            {post.titleKo}
          </h1>
          <p className="mb-4 text-sm text-gray-400">{post.title}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <time>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-lg border bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-600">
              {post.summaryKo}
            </p>
          </div>
        </header>

        <div className="prose-sm max-w-none space-y-1">{paragraphs}</div>
      </article>
    </div>
  );
}
