import { BackLink } from "@/components/navigation/BackLink";
import type { BlogPost } from "@/features/blog";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  const blocks = post.content
    .split("\n")
    .map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="mt-8 mb-3 text-xl font-bold text-neutral-950"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="mt-6 mb-2 text-lg font-semibold text-neutral-800"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h4
            key={index}
            className="mt-4 mb-1 text-base font-semibold text-neutral-800"
          >
            {line.replace("#### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li
            key={index}
            className="ml-4 list-disc text-sm leading-relaxed text-neutral-700"
          >
            {line.replace(/^- /, "")}
          </li>
        );
      }
      if (/^\d+\. /.test(line)) {
        return (
          <li
            key={index}
            className="ml-4 list-decimal text-sm leading-relaxed text-neutral-700"
          >
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      }
      if (line.startsWith("```")) {
        return null;
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-sm leading-relaxed text-neutral-700">
          {line}
        </p>
      );
    })
    .filter(Boolean);

  return (
    <article>
      <BackLink href="/learn">Back to learn</BackLink>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-950">{post.titleKo}</h1>
        <p className="mt-2 text-sm text-neutral-400">{post.title}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          <time>
            {new Date(post.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>{post.author}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 rounded-md border bg-white p-4">
          <p className="text-sm leading-relaxed text-neutral-600">
            {post.summaryKo}
          </p>
        </div>
      </header>

      <div className="max-w-none space-y-1">{blocks}</div>
    </article>
  );
}
