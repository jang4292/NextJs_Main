import { getAudioBaseUrl } from "@/lib/env";

/** Builds a full audio URL from a path relative to the configured audio bucket. */
export function audioUrl(path: string): string {
  return `${getAudioBaseUrl()}/${path}`;
}
