import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "프로젝트와 외부 링크 모음 페이지",
};

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Projects & Links</h1>

      <div className="w-full max-w-3xl px-4">
        <p className="mb-4 text-gray-600">
          아래 링크들은 여러가지 웹 사이트로 연결됩니다. 클릭하면 새 탭에서
          열립니다.
        </p>

        <ul className="grid gap-4">
          <li>
            <Link
              href="/games/solitaire"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open Solitaire game page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Solitaire</h2>
                  <p className="text-sm text-gray-500">
                    카드 한 벌로 즐기는 클론다이크 솔리테어
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/games/2048"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open 2048 game page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">2048</h2>
                  <p className="text-sm text-gray-500">
                    타일을 합쳐 2048을 만드는 퍼즐 게임
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/games/minesweeper"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open Minesweeper game page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">지뢰찾기</h2>
                  <p className="text-sm text-gray-500">
                    9×9 보드에서 지뢰 10개를 피해 칸을 여는 클래식 퍼즐 게임
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/games/freecell"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open FreeCell game page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">FreeCell</h2>
                  <p className="text-sm text-gray-500">
                    카드 한 벌로 즐기는 프리셀
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/games/sudoku"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open Sudoku game page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">스도쿠</h2>
                  <p className="text-sm text-gray-500">
                    9×9 보드에서 숫자를 채우는 클래식 스도쿠 퍼즐
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/DJ_Play_List"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open DJ Play List page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">DJ Play List (예정)</h2>
                  <p className="text-sm text-gray-500">
                    별도로 구상중인 DJ 재생 목록 페이지로 이동
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>

          <li>
            <a
              href="https://github.com/jang4292"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open GitHub profile in a new tab"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">GitHub</h2>
                  <p className="text-sm text-gray-500">
                    Code, projects and contributions
                  </p>
                </div>
                <div className="text-sm text-blue-500">↗</div>
              </div>
            </a>
          </li>

          <li>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open LinkedIn in a new tab"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">LinkedIn</h2>
                  <p className="text-sm text-gray-500">
                    Professional profile and contact
                  </p>
                </div>
                <div className="text-sm text-blue-500">↗</div>
              </div>
            </a>
          </li>

          <li>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open YouTube in a new tab"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">YouTube</h2>
                  <p className="text-sm text-gray-500">
                    Video content and demos
                  </p>
                </div>
                <div className="text-sm text-blue-500">↗</div>
              </div>
            </a>
          </li>

          <li>
            <Link
              href="/about"
              className="block rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              aria-label="Open About page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">About this site</h2>
                  <p className="text-sm text-gray-500">
                    내 사이트에 대한 소개 페이지 (내부 링크)
                  </p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
