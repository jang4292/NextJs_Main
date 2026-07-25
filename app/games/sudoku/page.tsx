import { Metadata } from "next";
import SudokuClient from "./SudokuClient";

export const metadata: Metadata = {
  title: "Sudoku",
  description: "9×9 보드에서 숫자를 채우는 클래식 스도쿠 퍼즐",
};

export default function SudokuPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-24 md:pb-6">
      {/* Extra bottom padding on mobile keeps the game controls clear of the
          fixed BottomNav (see components/BottomNav.tsx), which otherwise
          overlaps content at the end of the page. */}
      <h1 className="mb-2 text-3xl font-bold">스도쿠</h1>
      <p className="mb-6 text-sm text-gray-600">
        각 행, 열, 3×3 박스에 1부터 9까지의 숫자가 겹치지 않도록 빈 칸을 모두
        채우면 완성되는 싱글 플레이 퍼즐 게임입니다.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            PC 조작 방법
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>마우스 클릭으로 칸 선택</li>
            <li>키보드 1~9로 숫자 입력, Backspace/Delete로 삭제</li>
            <li>방향키로 선택 칸 이동, Escape로 선택 해제</li>
          </ul>
        </section>
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            모바일 조작 방법
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            <li>탭으로 칸 선택</li>
            <li>화면 숫자 패드로 입력 및 삭제</li>
            <li>일시정지 버튼으로 언제든 잠시 멈출 수 있음</li>
          </ul>
        </section>
      </div>

      <p className="mb-6 text-xs text-gray-400">
        Next.js App Router와 TypeScript로 구현했습니다. 게임 규칙은 React와
        무관한 순수 함수로 분리되어 있어 테스트가 용이하고, 향후 다른
        플랫폼으로도 이식할 수 있는 구조입니다.
      </p>

      <SudokuClient />
    </div>
  );
}
