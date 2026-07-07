"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[40vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h2 className="mb-2 text-xl font-bold text-gray-900">관리자 페이지 오류</h2>
      <p className="mb-5 text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        다시 시도
      </button>
    </div>
  );
}
