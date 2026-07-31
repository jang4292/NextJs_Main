import type { Metadata } from "next";
import { JapaneseVocabularyPage } from "@/features/vocabulary-japanese";

export const metadata: Metadata = {
  title: "Japanese Vocabulary",
  description:
    "기초 일본어 단어 50개의 한자, 히라가나, 뜻, 예문, 발음을 확인하는 학습 페이지",
};

export default function JapaneseVocabularyRoutePage() {
  return <JapaneseVocabularyPage />;
}
