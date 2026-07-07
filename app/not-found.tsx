import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 text-sm font-semibold text-blue-600">404</p>
      <h1 className="mb-3 text-3xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="mb-6 text-sm text-gray-600">
        요청하신 경로가 없거나 이동되었습니다. 아래 버튼으로 홈으로 이동해 주세요.
      </p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        홈으로 이동
      </Link>
    </div>
  );
}
