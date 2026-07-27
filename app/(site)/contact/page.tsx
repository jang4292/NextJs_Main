import { Metadata } from "next";
import { ContactForm } from "@/features/contact/presentation/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "문의 메일 전송 및 연락 페이지",
};

export default function ContactPage() {
  return <ContactForm />;
}
