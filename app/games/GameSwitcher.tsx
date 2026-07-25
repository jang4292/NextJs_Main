"use client";

import { gameCatalog } from "@/data/games";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isActiveGame(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GameSwitcher() {
  const pathname = usePathname();
  const currentGame = gameCatalog.find((game) =>
    isActiveGame(pathname, game.href),
  );

  if (!currentGame) {
    return null;
  }

  return (
    <section className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/games"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-blue-600"
          >
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            Games
          </Link>
          <span className="hidden text-neutral-300 sm:inline" aria-hidden="true">
            /
          </span>
          <span className="truncate text-sm font-semibold text-neutral-950 sm:inline">
            {currentGame.title}
          </span>
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-end gap-1 md:flex"
          aria-label="게임 전환"
        >
          {gameCatalog.map((game) => {
            const isActive = game.href === currentGame.href;

            return (
              <Link
                key={game.href}
                href={game.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                )}
              >
                {game.title}
              </Link>
            );
          })}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 md:hidden"
              aria-label="다른 게임 선택"
            >
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              게임 변경
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[80vh] overflow-y-auto rounded-t-lg p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          >
            <SheetHeader className="pr-8 text-left">
              <SheetTitle>게임 선택</SheetTitle>
              <SheetDescription>
                {currentGame.title}에서 다른 게임으로 바로 이동합니다.
              </SheetDescription>
            </SheetHeader>

            <nav className="mt-4 grid gap-2" aria-label="모바일 게임 전환">
              {gameCatalog.map((game) => {
                const isActive = game.href === currentGame.href;

                return (
                  <SheetClose asChild key={game.href}>
                    <Link
                      href={game.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-md border p-3 text-left transition-colors",
                        isActive
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white hover:bg-neutral-50",
                      )}
                    >
                      <span className="block text-sm font-semibold">
                        {game.title}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-xs",
                          isActive ? "text-neutral-200" : "text-neutral-500",
                        )}
                      >
                        {game.description}
                      </span>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
