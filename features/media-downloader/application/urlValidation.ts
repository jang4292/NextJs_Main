import type { MediaErrorCode, MediaPlatform } from "../domain/mediaTypes";
import { mediaErrorMessages } from "./errors";
import {
  canonicalizeYoutubeVideoUrl,
  isYoutubeSingleVideoUrl,
  normalizeHostname,
  resolveMediaPlatform,
} from "./platformResolver";
import { extractMediaUrlCandidate } from "./urlInput";

export type ValidatedMediaUrl = {
  ok: true;
  url: string;
  parsedUrl: URL;
  platform: MediaPlatform;
};

export type InvalidMediaUrl = {
  ok: false;
  code: MediaErrorCode;
  message: string;
};

export type MediaUrlValidationResult = ValidatedMediaUrl | InvalidMediaUrl;

const MAX_URL_LENGTH = 2048;

function invalid(code: MediaErrorCode): InvalidMediaUrl {
  return {
    ok: false,
    code,
    message: mediaErrorMessages[code],
  };
}

function parseIpv4(hostname: string): number[] | null {
  const parts = hostname.split(".");
  if (parts.length !== 4) return null;

  const octets = parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) return Number.NaN;
    return Number(part);
  });

  return octets.every(
    (octet) => Number.isInteger(octet) && octet >= 0 && octet <= 255,
  )
    ? octets
    : null;
}

function isBlockedIpv4(hostname: string): boolean {
  const octets = parseIpv4(hostname);
  if (!octets) return false;

  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isBlockedIpv6(hostname: string): boolean {
  const host = hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
  if (!host.includes(":")) return false;

  return (
    host === "::1" ||
    host === "::" ||
    host.startsWith("fc") ||
    host.startsWith("fd") ||
    host.startsWith("fe80:") ||
    host.startsWith("::ffff:127.") ||
    host.startsWith("::ffff:10.") ||
    host.startsWith("::ffff:192.168.")
  );
}

function isUnsafeHostname(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return (
    host === "" ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    isBlockedIpv4(host) ||
    isBlockedIpv6(host)
  );
}

export function validateMediaUrl(input: unknown): MediaUrlValidationResult {
  if (typeof input !== "string") {
    return invalid("INVALID_URL");
  }

  const trimmed = extractMediaUrlCandidate(input);
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) {
    return invalid("INVALID_URL");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return invalid("INVALID_URL");
  }

  if (parsedUrl.protocol !== "https:") {
    return invalid("INVALID_URL");
  }

  if (
    parsedUrl.username ||
    parsedUrl.password ||
    isUnsafeHostname(parsedUrl.hostname)
  ) {
    return invalid("INVALID_URL");
  }

  const platform = resolveMediaPlatform(parsedUrl);
  if (platform !== "youtube") {
    return invalid("UNSUPPORTED_PLATFORM");
  }

  if (!isYoutubeSingleVideoUrl(parsedUrl)) {
    return invalid("UNSUPPORTED_PLATFORM");
  }

  const canonicalUrl = canonicalizeYoutubeVideoUrl(parsedUrl);
  if (!canonicalUrl) {
    return invalid("UNSUPPORTED_PLATFORM");
  }

  return {
    ok: true,
    url: canonicalUrl.toString(),
    parsedUrl: canonicalUrl,
    platform,
  };
}
