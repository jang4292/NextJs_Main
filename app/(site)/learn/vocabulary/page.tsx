import type { Metadata } from "next";
import { VocabularyPage } from "@/features/vocabulary/components/VocabularyPage";

export const metadata: Metadata = {
  title: "English Vocabulary",
  description: "기초 영어 단어 50개의 뜻, 예문, 발음을 확인하는 학습 페이지",
};

export default function EnglishVocabularyPage() {
  return <VocabularyPage />;
}
