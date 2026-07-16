const AUDIO_BASE_URL =
  process.env.NEXT_PUBLIC_AUDIO_BASE_URL ??
  "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com";

/** Builds a full audio URL from a path relative to the configured audio bucket. */
export function audioUrl(path: string): string {
  return `${AUDIO_BASE_URL}/${path}`;
}
