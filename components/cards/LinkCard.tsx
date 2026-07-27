import Link from "next/link";

export function LinkCard({
  href,
  title,
  description,
  external = false,
}: {
  href: string;
  title: string;
  description: string;
  external?: boolean;
}) {
  const className =
    "group block rounded-md border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-900";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <CardInner title={title} description={description} suffix="External" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      <CardInner title={title} description={description} suffix="Open" />
    </Link>
  );
}

function CardInner({
  description,
  suffix,
  title,
}: {
  description: string;
  suffix: string;
  title: string;
}) {
  return (
    <span className="flex items-center justify-between gap-4">
      <span>
        <span className="block text-sm font-semibold text-neutral-950">
          {title}
        </span>
        <span className="mt-1 block text-sm text-neutral-500">
          {description}
        </span>
      </span>
      <span className="shrink-0 text-sm font-medium text-neutral-700">
        {suffix}
      </span>
    </span>
  );
}
