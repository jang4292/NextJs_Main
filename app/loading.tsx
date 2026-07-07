export default function GlobalLoading() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-2xl items-center justify-center px-6">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        페이지를 불러오는 중입니다...
      </div>
    </div>
  );
}
