import type {
  ContentType,
  DifficultyLevel,
  LanguageType,
  TypingContent,
} from "../../domain/typing.types";

export interface SelectContentOptions {
  language: LanguageType;
  difficulty: DifficultyLevel;
  type?: ContentType;
  activeTexts?: readonly string[];
  previousContentId?: string | null;
  rng?: () => number;
}

export function getEligibleContents(
  contents: readonly TypingContent[],
  options: Omit<SelectContentOptions, "rng">,
): TypingContent[] {
  const activeTexts = new Set(options.activeTexts ?? []);

  return contents.filter(
    (content) =>
      content.enabled &&
      content.language === options.language &&
      content.difficulty === options.difficulty &&
      content.type === (options.type ?? "word") &&
      !activeTexts.has(content.text) &&
      content.id !== options.previousContentId,
  );
}

export function selectTypingContent(
  contents: readonly TypingContent[],
  options: SelectContentOptions,
): TypingContent | null {
  const eligibleContents = getEligibleContents(contents, options);
  if (eligibleContents.length === 0) return null;

  const rng = options.rng ?? Math.random;
  const index = Math.floor(rng() * eligibleContents.length);
  return eligibleContents[Math.min(index, eligibleContents.length - 1)];
}
