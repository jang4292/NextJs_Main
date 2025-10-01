export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-3xl font-bold mb-6">Projects & Links</h1>

      <div className="w-full max-w-3xl px-4">
        <p className="mb-4 text-gray-600">아래 링크들은 여러가지 웹 사이트로 연결됩니다. 클릭하면 새 탭에서 열립니다.</p>

        <ul className="grid gap-4">
          <li>
            <a
              href="/DJ_Play_List"
              className="block p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
              aria-label="Open DJ Play List page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">DJ Play List (예정)</h2>
                  <p className="text-sm text-gray-500">별도로 구상중인 DJ 재생 목록 페이지로 이동</p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </a>
          </li>

          <li>
            <a
              href="https://github.com/jang4292"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
              aria-label="Open GitHub profile in a new tab"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">GitHub</h2>
                  <p className="text-sm text-gray-500">Code, projects and contributions</p>
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
              className="block p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
              aria-label="Open LinkedIn in a new tab"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">LinkedIn</h2>
                  <p className="text-sm text-gray-500">Professional profile and contact</p>
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
              className="block p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
              aria-label="Open YouTube in a new tab"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">YouTube</h2>
                  <p className="text-sm text-gray-500">Video content and demos</p>
                </div>
                <div className="text-sm text-blue-500">↗</div>
              </div>
            </a>
          </li>

          <li>
            <a
              href="/about"
              className="block p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
              aria-label="Open About page"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">About this site</h2>
                  <p className="text-sm text-gray-500">내 사이트에 대한 소개 페이지 (내부 링크)</p>
                </div>
                <div className="text-sm text-blue-500">→</div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
