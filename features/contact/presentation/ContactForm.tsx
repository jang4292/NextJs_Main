"use client";

import { useContactFormViewModel } from "@/features/contact/presentation/hooks/useContactFormViewModel";

export function ContactForm() {
  const vm = useContactFormViewModel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await vm.submit();
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-md bg-white p-6 shadow-md">
      <h2 className="mb-6 text-3xl font-semibold text-blue-600">Contact Us</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block font-medium text-gray-700">타이틀</label>
          <input
            type="text"
            value={vm.title}
            onChange={(e) => vm.setTitle(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700">
            보내는 사람 (이메일)
          </label>
          <input
            type="email"
            value={vm.sender}
            onChange={(e) => vm.setSender(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700">내용</label>
          <textarea
            rows={6}
            value={vm.content}
            onChange={(e) => vm.setContent(e.target.value)}
            required
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={vm.loading}
          className={`w-full rounded-md py-2 font-semibold text-white ${
            vm.loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {vm.loading ? "전송 중..." : "보내기"}
        </button>
      </form>

      {vm.resultMessage && (
        <p
          className={`mt-4 text-center font-medium ${
            vm.isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {vm.resultMessage}
        </p>
      )}

      <section className="mt-10 rounded-md border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          HTML 메일 미리보기
        </h3>
        <div className="prose max-w-none rounded-md bg-white p-4 shadow-inner">
          <h1 className="mb-4 text-2xl text-blue-600">{vm.title}</h1>
          <p className="mb-3">
            보내는 사람: <strong>{vm.sender}</strong>
          </p>
          <hr className="my-4" />
          <pre className="text-base leading-relaxed whitespace-pre-wrap">
            {vm.content}
          </pre>
          <footer className="mt-8 text-xs text-gray-500">
            이 메일은 자동 발송된 메시지입니다.
          </footer>
        </div>
      </section>
    </div>
  );
}
