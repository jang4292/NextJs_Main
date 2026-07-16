import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "관리자 사용자 관리 페이지",
};

export default function AdminUsersPage() {
  const adminUsername = process.env.ADMIN_USERNAME ?? "-";

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">사용자 관리</h2>
      <p className="mb-4 text-sm text-gray-500">
        현재 별도의 사용자 데이터베이스는 없으며, 환경 변수로 설정된 관리자 계정
        1개만 존재합니다.
      </p>

      <table className="w-full max-w-lg overflow-hidden rounded-lg border bg-white text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-2 font-medium">아이디</th>
            <th className="px-4 py-2 font-medium">역할</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">{adminUsername}</td>
            <td className="px-4 py-2">Admin</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
