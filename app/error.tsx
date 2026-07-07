"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 text-2xl font-bold text-gray-900">오류가 발생했습니다</h1>
      <p className="mb-6 text-sm text-gray-600">
        일시적인 문제일 수 있습니다. 다시 시도해 주세요.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        다시 시도
      </button>
    </div>
  );
}
