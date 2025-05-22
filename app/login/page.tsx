"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 더미 로그인 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 실제 로그인 API 호출 자리
    if (username === "admin" && password === "password") {
      // 로그인 성공
      // 실제 인증 토큰 처리, 전역 상태 업데이트 필요
      router.push("/"); // 로그인 성공 후 홈으로 이동
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-md shadow-md"
        aria-label="로그인 폼"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        {error && (
          <p className="mb-4 text-red-600 text-center" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="username" className="block mb-2 font-medium">
          아이디
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="username"
        />

        <label htmlFor="password" className="block mb-2 font-medium">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
