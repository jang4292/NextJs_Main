import { Metadata } from "next";
import { requireAdminSession } from "@/lib/adminSession";
import AdminLayoutClient from "@/features/admin/presentation/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin",
  description: "관리자 대시보드 및 사용자 관리 페이지",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
