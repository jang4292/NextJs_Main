import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "관리자 사용자 관리 페이지",
};

export default function AdminHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">2관리자 대시보드</h2>
      {/* 관리자 주요 콘텐츠 */}
    </div>
  );
}