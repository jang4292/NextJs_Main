import type { MediaPlatform } from "../domain/mediaTypes";

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be"]);
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.+$/, "");
}

export function resolveMediaPlatform(url: URL | string): MediaPlatform {
  const parsedUrl = typeof url === "string" ? new URL(url) : url;
  const hostname = normalizeHostname(parsedUrl.hostname);

  if (YOUTUBE_HOSTS.has(hostname)) {
    return "youtube";
  }

  return "unknown";
}

function normalizeYoutubeVideoId(
  value: string | null | undefined,
): string | null {
  const videoId = value?.trim() ?? "";
  return YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
}

export function getYoutubeVideoId(url: URL): string | null {
  const hostname = normalizeHostname(url.hostname);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const firstPathSegment = pathSegments[0] ?? "";

  if (hostname === "youtu.be") {
    if (firstPathSegment === "playlist") return null;
    return normalizeYoutubeVideoId(firstPathSegment);
  }

  if (hostname === "youtube.com" || hostname === "www.youtube.com") {
    if (url.pathname === "/watch") {
      return normalizeYoutubeVideoId(url.searchParams.get("v"));
    }

    if (firstPathSegment === "shorts" || firstPathSegment === "embed") {
      return normalizeYoutubeVideoId(pathSegments[1]);
    }
  }

  return null;
}

export function canonicalizeYoutubeVideoUrl(url: URL): URL | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;

  const canonicalUrl = new URL("https://www.youtube.com/watch");
  canonicalUrl.searchParams.set("v", videoId);
  return canonicalUrl;
}

export function isYoutubeSingleVideoUrl(url: URL): boolean {
  return Boolean(getYoutubeVideoId(url));
}
