import type {
  DifficultyConfig,
  FallingWord,
  TypingContent,
} from "../../domain/typing.types";

export function createFallingWord({
  content,
  config,
  now,
  sequence,
  rng = Math.random,
}: {
  content: TypingContent;
  config: DifficultyConfig;
  now: number;
  sequence: number;
  rng?: () => number;
}): FallingWord {
  return {
    id: `typing-rain-${now}-${sequence}`,
    contentId: content.id,
    text: content.text,
    x: Math.round(8 + rng() * 78),
    speed: 1,
    spawnedAt: now,
    fallDurationMs: config.fallDurationMs,
    status: "active",
  };
}
