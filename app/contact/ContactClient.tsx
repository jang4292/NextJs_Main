"use client";

import { useState } from "react";

interface SendEmailRequest {
  title: string;
  sender: string;
  content: string;
}

interface SendEmailResponse {
  message: string;
}

interface ErrorResponse {
  message: string;
}

export default function ContactClient() {
  const [title, setTitle] = useState("문의합니다");
  const [sender, setSender] = useState("user@example.com");
  const [content, setContent] = useState(
    "안녕하세요.\n문의사항이 있어 연락드립니다.\n좋은 하루 보내세요!",
  );
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  async function sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // 서버에서 오는 에러 메시지 타입을 명확히 읽음
      const errorData: ErrorResponse = await res.json();
      throw new Error(errorData.message || "메일 발송 실패");
    }

    return res.json();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage("");
    setIsSuccess(null);

    try {
      const response = await sendEmail({ title, sender, content });
      setResultMessage(response.message);
      setIsSuccess(true);
      setTitle("");
      setSender("");
      setContent("");
    } catch (error) {
      // error가 Error 객체인지 체크하고 message 가져오기
      if (error instanceof Error) {
        setResultMessage(error.message);
      } else {
        setResultMessage("알 수 없는 오류가 발생했습니다.");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-md bg-white p-6 shadow-md">
      <h2 className="mb-6 text-3xl font-semibold text-blue-600">Contact Us</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block font-medium text-gray-700">타이틀</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700">
            보내는 사람 (이메일)
          </label>
          <input
            type="email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700">내용</label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md py-2 font-semibold text-white ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "전송 중..." : "보내기"}
        </button>
      </form>

      {resultMessage && (
        <p
          className={`mt-4 text-center font-medium ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {resultMessage}
        </p>
      )}

      <section className="mt-10 rounded-md border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          HTML 메일 미리보기
        </h3>
        <div className="prose max-w-none rounded-md bg-white p-4 shadow-inner">
          <h1 className="mb-4 text-2xl text-blue-600">{title}</h1>
          <p className="mb-3">
            보내는 사람: <strong>{sender}</strong>
          </p>
          <hr className="my-4" />
          <pre className="whitespace-pre-wrap text-base leading-relaxed">
            {content}
          </pre>
          <footer className="mt-8 text-xs text-gray-500">
            이 메일은 자동 발송된 메시지입니다.
          </footer>
        </div>
      </section>
    </div>
  );
}
