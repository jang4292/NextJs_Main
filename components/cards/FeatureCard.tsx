import Link from "next/link";

export function FeatureCard({
  eyebrow,
  title,
  description,
  href,
  cta = "Open",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-md border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-900"
    >
      <div className="flex-1">
        {eyebrow && (
          <p className="text-xs font-semibold text-emerald-700 uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-lg font-semibold text-neutral-950">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {description}
        </p>
      </div>
      <span className="mt-5 text-sm font-medium text-neutral-900 group-hover:underline">
        {cta}
      </span>
    </Link>
  );
}
