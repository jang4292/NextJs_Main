import type { MediaPlatform } from "../domain/mediaTypes";

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be"]);

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

export function isYoutubeSingleVideoUrl(url: URL): boolean {
  const hostname = normalizeHostname(url.hostname);
  const firstPathSegment = url.pathname.split("/").filter(Boolean)[0] ?? "";

  if (hostname === "youtu.be") {
    return firstPathSegment.length > 0 && firstPathSegment !== "playlist";
  }

  if (hostname === "youtube.com" || hostname === "www.youtube.com") {
    if (url.pathname === "/watch" && url.searchParams.has("v")) return true;
    if (firstPathSegment === "shorts") return url.pathname.split("/")[2] !== "";
    if (firstPathSegment === "embed") return url.pathname.split("/")[2] !== "";
  }

  return false;
}
