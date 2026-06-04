export default function AdminLoading() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        관리자 페이지를 불러오는 중...
      </div>
    </div>
  );
}
