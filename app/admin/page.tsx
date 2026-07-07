import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "관리자 대시보드 메인",
};

export default function AdminHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">1관리자 대시보드</h2>
      {/* 관리자 주요 콘텐츠 */}
    </div>
  );
}