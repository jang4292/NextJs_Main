import { Metadata } from "next";
import MinesweeperClient from "./MinesweeperClient";

export const metadata: Metadata = {
  title: "지뢰찾기",
  description: "9×9 보드에서 지뢰 10개를 피해 모든 안전한 칸을 여는 클래식 지뢰찾기 게임",
};

export default function MinesweeperPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-2 text-3xl font-bold">지뢰찾기</h1>
      <p className="mb-6 text-sm text-gray-600">
        9×9 보드에 숨겨진 지뢰 10개를 피해 모든 안전한 칸을 열면 승리하는 싱글 플레이 퍼즐 게임입니다. 숫자는 해당
        칸 주변 8칸에 있는 지뢰의 개수를 알려줍니다.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">PC 조작 방법</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>왼쪽 클릭: 칸 열기</li>
            <li>오른쪽 클릭: 깃발 설정 / 해제</li>
            <li>새 게임 버튼으로 언제든 다시 시작</li>
          </ul>
        </section>
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">모바일 조작 방법</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>짧게 탭: 칸 열기</li>
            <li>길게 누르기: 깃발 설정 / 해제</li>
            <li>깃발 모드 버튼을 켜면 탭만으로 깃발을 설정 / 해제</li>
          </ul>
        </section>
      </div>

      <p className="mb-6 text-xs text-gray-400">
        Next.js App Router와 TypeScript로 구현했습니다. 게임 규칙은 React와 무관한 순수 함수로 분리되어 있어
        테스트가 용이하고, 향후 다른 플랫폼으로도 이식할 수 있는 구조입니다.
      </p>

      <MinesweeperClient />
    </div>
  );
}
