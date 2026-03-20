"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout, deleteAccount } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!user) return null;

  function handleDeleteAccount() {
    if (confirmText !== user?.username) return;
    deleteAccount();
    router.push("/");
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">내 프로필</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">계정 정보</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">아이디</dt>
            <dd className="font-medium">{user.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">이메일</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">가입일</dt>
            <dd className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("ko-KR")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
        >
          로그아웃
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors font-medium border border-red-200"
        >
          회원탈퇴
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3 text-red-600">회원탈퇴 확인</h3>
            <p className="text-sm text-gray-600 mb-4">
              탈퇴하시면 계정이 삭제되며 복구할 수 없습니다.
              <br />
              계속하려면 아이디{" "}
              <strong className="text-gray-900">{user.username}</strong>을(를) 입력해 주세요.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={user.username}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmText("");
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== user.username}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
