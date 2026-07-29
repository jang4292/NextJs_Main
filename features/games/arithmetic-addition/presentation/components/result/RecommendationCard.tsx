"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearningRecommendation } from "../../../domain/learningProgress.types";

interface RecommendationCardProps {
  recommendation: LearningRecommendation;
  onAction: (recommendation: LearningRecommendation) => void;
}

export function RecommendationCard({
  recommendation,
  onAction,
}: RecommendationCardProps) {
  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-950">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-sky-700">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold">{recommendation.title}</h3>
          <p className="mt-1 text-sm leading-6 opacity-80">
            {recommendation.message}
          </p>
        </div>
      </div>
      {recommendation.actionLabel && (
        <Button
          type="button"
          onClick={() => onAction(recommendation)}
          className="mt-3 min-h-11 bg-sky-700 hover:bg-sky-800"
        >
          {recommendation.actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </section>
  );
}
