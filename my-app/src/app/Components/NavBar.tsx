import Link from "next/link";

export default function NavBar() {
  return (
    <header className="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
      <h1 className="flex-1 flex justify-between items-center; text-xl font-bold">
        제이의 포트폴리오
      </h1>

      <div
        className="hidden md:flex md:items-center md:w-auto w-full"
        id="menu"
      >
        <nav>
          <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
            <li>
              <Link className="md:p-4 py-3 px-0 block" href="/">
                Home
              </Link>
            </li>

            {/* Projects 드롭다운 */}
            <li className="relative group">
              <Link
                href="/projects"
                className="md:p-4 py-3 px-0 block cursor-pointer"
              >
                Projects
              </Link>

              <ul className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    href="/tax-calculator/"
                  >
                    Tax Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    href="/projects/frontend"
                  >
                    프론트엔드
                  </Link>
                </li>
                <li>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-100"
                    href="/projects/backend"
                  >
                    백엔드
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link className="md:p-4 py-3 px-0 block" href="/about">
                About
              </Link>
            </li>

            <li>
              <Link className="md:p-4 py-3 px-0 block" href="#">
                Blog
              </Link>
            </li>
            <li>
              <Link className="md:p-4 py-3 px-0 block md:mb-0 mb-2" href="#">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
