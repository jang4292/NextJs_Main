import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-24 text-center">
      <h2 className="text-5xl font-bold mb-4">안녕하세요, 제이입니다.</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        12년 경력의 풀스택 개발자이자 슬롯 게임 전문가입니다. 다양한 플랫폼에서
        서비스와 게임을 개발하고 운영한 경험이 있습니다.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/resume.pdf"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          이력서 보기
        </a>

        <Link
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50"
          href="/Projects"
        >
          프로젝트 보기
        </Link>
      </div>
    </section>
  );
}
