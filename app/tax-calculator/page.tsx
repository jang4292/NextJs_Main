import { Metadata } from "next";
import TaxCalculatorClient from "./TaxCalculatorClient";

export const metadata: Metadata = {
  title: "Tax Calculator",
  description: "2025 세금 계산기 페이지",
};

export default function TaxCalculatorPage() {
  return <TaxCalculatorClient />;
}
