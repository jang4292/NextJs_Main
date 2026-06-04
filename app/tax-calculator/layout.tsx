import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Calculator",
  description: "2025 세금 계산기 페이지",
};

export default function TaxCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
