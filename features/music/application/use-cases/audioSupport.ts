export type AudioCanPlayType = (mimeType: string) => CanPlayTypeResult;

const AUDIO_MIME_CANDIDATES_BY_EXTENSION: Record<string, string[]> = {
  aac: ["audio/aac"],
  flac: ["audio/flac", "audio/x-flac"],
  m4a: ["audio/mp4", "audio/x-m4a"],
  mp3: ["audio/mpeg", "audio/mp3"],
  mp4: ["audio/mp4"],
  oga: ["audio/ogg"],
  ogg: ["audio/ogg"],
  opus: ["audio/ogg; codecs=opus", "audio/opus"],
  wav: ["audio/wav", "audio/x-wav"],
  webm: ["audio/webm"],
};

let browserAudioProbe: HTMLAudioElement | null = null;

export function canPlayAudioSource(
  source: string,
  canPlayType: AudioCanPlayType | null = getBrowserCanPlayType(),
): boolean {
  const trimmedSource = source.trim();

  if (!trimmedSource) {
    return false;
  }

  if (trimmedSource.startsWith("blob:") || trimmedSource.startsWith("data:")) {
    return true;
  }

  const mimeCandidates = getAudioMimeCandidates(trimmedSource);

  if (mimeCandidates.length === 0 || typeof canPlayType !== "function") {
    return true;
  }

  return mimeCandidates.some((mimeType) => canPlayType(mimeType) !== "");
}

export function getAudioMimeCandidates(source: string): string[] {
  const extension = getAudioExtension(source);

  return extension ? (AUDIO_MIME_CANDIDATES_BY_EXTENSION[extension] ?? []) : [];
}

function getBrowserCanPlayType(): AudioCanPlayType | null {
  if (typeof document === "undefined") {
    return null;
  }

  browserAudioProbe ??= document.createElement("audio");

  return (mimeType) => browserAudioProbe?.canPlayType(mimeType) ?? "";
}

function getAudioExtension(source: string): string | null {
  const pathname = getSourcePathname(source);
  const match = /\.([a-z0-9]+)$/.exec(pathname.toLowerCase());

  return match?.[1] ?? null;
}

function getSourcePathname(source: string): string {
  try {
    return new URL(source, "https://local.invalid").pathname;
  } catch {
    return source.split(/[?#]/, 1)[0] ?? source;
  }
}
