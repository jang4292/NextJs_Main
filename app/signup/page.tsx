"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    const result = register(username, email, password);
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-md shadow-md"
        aria-label="회원가입 폼"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {error && (
          <p className="mb-4 text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-green-600 text-center" role="status">
            {success} 로그인 페이지로 이동합니다...
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
          minLength={2}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="username"
          placeholder="2자 이상"
        />

        <label htmlFor="email" className="block mb-2 font-medium">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="email"
          placeholder="example@email.com"
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
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="new-password"
          placeholder="6자 이상"
        />

        <label htmlFor="confirmPassword" className="block mb-2 font-medium">
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="new-password"
          placeholder="비밀번호 재입력"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          회원가입
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}
