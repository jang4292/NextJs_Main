"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Users } from "lucide-react";
import Link from "next/link";
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="flex-1 p-2 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden m-2">
            ☰
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 text-xl font-bold">Admin Panel</div>
          <nav className="p-2 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
