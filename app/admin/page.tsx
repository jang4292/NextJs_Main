import Link from "next/link";
import { Metadata } from "next";
import { Users } from "lucide-react";
import {
  getAdminSessionUsername,
  requireAdminSession,
} from "@/lib/adminSession";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "관리자 대시보드 메인",
};

export default async function AdminHome() {
  const username = getAdminSessionUsername(await requireAdminSession());

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold">관리자 대시보드</h2>
      <p className="mb-6 text-gray-500">환영합니다, {username}님.</p>

      <Link
        href="/admin/users"
        className="flex max-w-sm items-center gap-4 rounded-lg border bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm"
      >
        <Users className="h-8 w-8 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-900">사용자 관리</p>
          <p className="text-sm text-gray-500">관리자 계정 정보 확인</p>
        </div>
      </Link>
    </div>
  );
}
