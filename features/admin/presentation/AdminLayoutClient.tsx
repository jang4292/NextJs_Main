"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", icon: <Home />, path: "/admin" },
  { name: "Users", icon: <Users />, path: "/admin/users" },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden w-64 border-r bg-white md:flex md:flex-col">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="flex-1 space-y-2 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="flex items-center gap-3 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <LogOut />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="m-2 md:hidden">
            ☰
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 text-xl font-bold">Admin Panel</div>
          <nav className="space-y-2 p-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center gap-3 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut />
              <span>로그아웃</span>
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
