const HTTPS_URL_CANDIDATE_PATTERN = /https:\/\/[^\s<>"'`\]\)]+/i;
const MARKDOWN_LINK_PATTERN = /\[[^\]]*]\((https:\/\/[^)\s]+)\)/i;

function stripUrlBoundaryCharacters(value: string): string {
  return value
    .trim()
    .replace(/^[`'"\[<(]+/, "")
    .replace(/[`'",.!?;\]\)>]+$/, "");
}

function stripMatchedWrappingQuotes(value: string): string {
  let nextValue = value.trim();

  while (nextValue.length >= 2) {
    const firstCharacter = nextValue[0];
    const lastCharacter = nextValue[nextValue.length - 1];
    const hasMatchedQuotes =
      (firstCharacter === "'" && lastCharacter === "'") ||
      (firstCharacter === '"' && lastCharacter === '"') ||
      (firstCharacter === "`" && lastCharacter === "`");

    if (!hasMatchedQuotes) break;
    nextValue = nextValue.slice(1, -1).trim();
  }

  return nextValue;
}

export function extractMediaUrlCandidate(input: unknown): string {
  if (typeof input !== "string") return "";

  const trimmedInput = stripMatchedWrappingQuotes(input);
  if (!trimmedInput) return "";

  const markdownLinkMatch = MARKDOWN_LINK_PATTERN.exec(trimmedInput);
  if (markdownLinkMatch?.[1]) {
    return stripUrlBoundaryCharacters(markdownLinkMatch[1]);
  }

  const urlMatch = HTTPS_URL_CANDIDATE_PATTERN.exec(trimmedInput);
  return urlMatch ? stripUrlBoundaryCharacters(urlMatch[0]) : "";
}
