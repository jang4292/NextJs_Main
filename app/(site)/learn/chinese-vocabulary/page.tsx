import type { Metadata } from "next";
import { ChineseVocabularyPage } from "@/features/vocabulary-chinese";

export const metadata: Metadata = {
  title: "Chinese Vocabulary",
  description:
    "기초 중국어 단어 50개의 간체자, 병음, 뜻, 예문, 발음을 확인하는 학습 페이지",
};

export default function ChineseVocabularyRoutePage() {
  return <ChineseVocabularyPage />;
}
