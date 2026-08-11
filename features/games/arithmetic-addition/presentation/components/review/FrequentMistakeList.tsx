"use client";

import type { MistakeRecord } from "../../../domain/learningProgress.types";
import { MistakeList } from "./MistakeList";

interface FrequentMistakeListProps {
  mistakes: MistakeRecord[];
}

export function FrequentMistakeList({ mistakes }: FrequentMistakeListProps) {
  return (
    <MistakeList mistakes={mistakes} emptyLabel="자주 틀린 문제가 없어요." />
  );
}
