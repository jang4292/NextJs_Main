"use client";

import type { MistakeRecord } from "../../../domain/learningProgress.types";
import { MistakeList } from "./MistakeList";

interface RecentMistakeListProps {
  mistakes: MistakeRecord[];
}

export function RecentMistakeList({ mistakes }: RecentMistakeListProps) {
  return <MistakeList mistakes={mistakes} emptyLabel="최근 오답이 없어요." />;
}
