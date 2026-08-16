const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const RESERVED_FILENAME_CHARACTERS = /[<>:"/\\|?*]+/g;
const WHITESPACE = /\s+/g;
const MULTIPLE_DASHES = /-+/g;

export function sanitizeDownloadFilename(
  title: string | undefined,
  fallback = "media-download",
): string {
  const normalized = (title ?? "")
    .normalize("NFKC")
    .replace(CONTROL_CHARACTERS, "")
    .replace(RESERVED_FILENAME_CHARACTERS, "-")
    .replace(WHITESPACE, "-")
    .replace(MULTIPLE_DASHES, "-")
    .replace(/^[.\s-]+/, "")
    .replace(/[.\s-]+$/, "")
    .trim();

  if (!normalized) {
    return fallback;
  }

  return normalized.slice(0, 120) || fallback;
}

export function buildContentDispositionFilename(
  title: string | undefined,
  extension: string,
): string {
  const safeBaseName = sanitizeDownloadFilename(title);
  const safeExtension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return `${safeBaseName}.${safeExtension || "bin"}`;
}
