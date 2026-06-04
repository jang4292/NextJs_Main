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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-gray-900">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-gray-800">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h4 key={i} className="text-base font-semibold mt-4 mb-1 text-gray-800">
            {line.replace("#### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- ✅") || line.startsWith("- ❌") || line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4 text-gray-700 text-sm leading-relaxed list-disc">
            {line.replace(/^- /, "")}
          </li>
        );
      }
      if (line.startsWith("1. ") || /^\d+\. /.test(line)) {
        return (
          <li key={i} className="ml-4 text-gray-700 text-sm leading-relaxed list-decimal">
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
        <p key={i} className="text-gray-700 text-sm leading-relaxed">
          {line}
        </p>
      );
    })
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/blog"
        className="text-sm text-blue-600 hover:underline mb-6 inline-block"
      >
        ← 블로그 목록으로
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{post.titleKo}</h1>
          <p className="text-sm text-gray-400 mb-4">{post.title}</p>
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
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm text-gray-600 leading-relaxed">{post.summaryKo}</p>
          </div>
        </header>

        <div className="prose-sm max-w-none space-y-1">{paragraphs}</div>
      </article>
    </div>
  );
}
