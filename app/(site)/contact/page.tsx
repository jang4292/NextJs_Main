import { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { BackLink } from "@/components/navigation/BackLink";
import { ContactForm } from "@/features/contact/presentation/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "문의 메일 전송 및 연락 페이지",
};

export default function ContactPage() {
  return (
    <PageShell size="narrow">
      <BackLink href="/about">Back to profile</BackLink>
      <SectionHeader
        eyebrow="Profile"
        title="Contact"
        description="프로젝트, 협업, 기술 상담과 관련된 내용을 이메일로 전달합니다."
      />
      <ContactForm />
    </PageShell>
  );
}
