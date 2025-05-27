'use client';

import { useState } from 'react';

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

export default function ContactPage() {
  const [title, setTitle] = useState('문의합니다');
  const [sender, setSender] = useState('user@example.com');
  const [content, setContent] = useState(
    '안녕하세요.\n문의사항이 있어 연락드립니다.\n좋은 하루 보내세요!'
  );
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const generateHtmlTemplate = () => `
    <div style="font-family: 'Inter', sans-serif; color: #1f2937; padding: 24px; background-color: #f9fafb;">
      <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 16px;">${title}</h1>
      <p style="margin-bottom: 12px;">보내는 사람: <strong>${sender}</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
      <pre style="white-space: pre-wrap; font-size: 16px; line-height: 1.5;">${content}</pre>
      <footer style="margin-top: 32px; font-size: 12px; color: #6b7280;">
        이 메일은 자동 발송된 메시지입니다.
      </footer>
    </div>
  `;

  async function sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
    debugger
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // 서버에서 오는 에러 메시지 타입을 명확히 읽음
      const errorData: ErrorResponse = await res.json();
      throw new Error(errorData.message || '메일 발송 실패');
    }

    return res.json();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage('');
    setIsSuccess(null);

    try {
      const response = await sendEmail({ title, sender, content: generateHtmlTemplate() });
      setResultMessage(response.message);
      setIsSuccess(true);
      setTitle('');
      setSender('');
      setContent('');
    } catch (error) {
      // error가 Error 객체인지 체크하고 message 가져오기
      if (error instanceof Error) {
        setResultMessage(error.message);
      } else {
        setResultMessage('알 수 없는 오류가 발생했습니다.');
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-blue-600">Contact Us</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium text-gray-700">타이틀</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">보내는 사람 (이메일)</label>
          <input
            type="email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">내용</label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '전송 중...' : '보내기'}
        </button>
      </form>

      {resultMessage && (
        <p
          className={`mt-4 text-center font-medium ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {resultMessage}
        </p>
      )}

      <section className="mt-10 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">HTML 메일 미리보기</h3>
        <div
          className="prose max-w-none bg-white p-4 rounded-md shadow-inner"
          dangerouslySetInnerHTML={{ __html: generateHtmlTemplate() }}
        />
      </section>
    </div>
  );
}
