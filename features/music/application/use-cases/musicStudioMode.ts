export const MUSIC_STUDIO_MODES = ["history", "custom", "source"] as const;

export type MusicStudioMode = (typeof MUSIC_STUDIO_MODES)[number];

export function resolveMusicStudioMode(value?: string): MusicStudioMode {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue === "custom" || normalizedValue === "queue") {
    return "custom";
  }

  if (normalizedValue === "dj") {
    return "custom";
  }

  if (normalizedValue === "source" || normalizedValue === "json") {
    return "source";
  }

  return "history";
}
