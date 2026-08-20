import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackLink({
  children,
  href,
}: {
  children: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
