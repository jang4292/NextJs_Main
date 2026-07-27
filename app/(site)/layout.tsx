import { BottomNav } from "@/components/navigation/BottomNav";
import { Footer } from "@/components/navigation/Footer";
import { SiteNav } from "@/components/navigation/SiteNav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
