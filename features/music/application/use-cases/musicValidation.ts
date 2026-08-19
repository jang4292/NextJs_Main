import type {
  EnergyLevel,
  MusicTrack,
} from "@/features/music/domain/entities/MusicTrack";
import { canPlayAudioSource, type AudioCanPlayType } from "./audioSupport";

export type MusicTrackValidationResult = {
  tracks: MusicTrack[];
  errors: string[];
  hiddenCount: number;
  unavailableCount: number;
};

export type MusicTrackPlaybackUnavailableReason =
  "disabled" | "unsupported-format";

const energyLevels = new Set<EnergyLevel>(["low", "medium", "high"]);

export function parseMusicTrackList(
  input: unknown,
): MusicTrackValidationResult {
  if (!Array.isArray(input)) {
    return {
      tracks: [],
      errors: ["Music JSON must be an array of tracks."],
      hiddenCount: 0,
      unavailableCount: 0,
    };
  }

  const errors: string[] = [];
  const tracks: MusicTrack[] = [];

  input.forEach((candidate, index) => {
    const result = parseMusicTrack(candidate, index);

    if (result.track) {
      tracks.push(result.track);
    }

    errors.push(...result.errors);
  });

  return {
    tracks,
    errors,
    hiddenCount: tracks.filter((track) => track.isVisible === false).length,
    unavailableCount: tracks.filter((track) => track.isAvailable === false)
      .length,
  };
}

export function parseMusicTrack(
  input: unknown,
  index = 0,
): { track: MusicTrack | null; errors: string[] } {
  if (!isRecord(input)) {
    return {
      track: null,
      errors: [`Track at index ${index} must be an object.`],
    };
  }

  const errors: string[] = [];
  const id = readRequiredString(input, "id", index, errors);
  const artist = readRequiredString(input, "artist", index, errors);
  const title = readRequiredString(input, "title", index, errors);
  const audioUrl = readRequiredString(input, "audioUrl", index, errors);

  if (audioUrl && !isSupportedAudioUrl(audioUrl)) {
    errors.push(
      `Track ${describeTrack(id, index)} has an unsupported audioUrl.`,
    );
  }

  if (errors.length > 0 || !id || !artist || !title || !audioUrl) {
    return { track: null, errors };
  }

  return {
    track: {
      id,
      artist,
      title,
      audioUrl,
      bpm: readOptionalNumber(input.bpm),
      musicType: readOptionalString(input.musicType),
      duration: readOptionalNumber(input.duration),
      tags: readOptionalStringArray(input.tags),
      source: readOptionalString(input.source),
      description: readOptionalString(input.description),
      album: readOptionalString(input.album),
      year: readOptionalNumber(input.year),
      genre: readOptionalString(input.genre),
      danceType: readOptionalString(input.danceType),
      energyLevel: readOptionalEnergyLevel(input.energyLevel),
      isFavorite: readOptionalBoolean(input.isFavorite),
      isAvailable: readOptionalBoolean(input.isAvailable),
      isVisible: readOptionalBoolean(input.isVisible),
      createdAt: readOptionalString(input.createdAt),
      updatedAt: readOptionalString(input.updatedAt),
    },
    errors: [],
  };
}

export function isVisibleMusicTrack(track: MusicTrack): boolean {
  return track.isVisible !== false;
}

export function isAvailableMusicTrack(track: MusicTrack): boolean {
  return track.isAvailable !== false;
}

export function isPlayableMusicTrack(
  track: MusicTrack,
  canPlayType?: AudioCanPlayType | null,
): boolean {
  return (
    isVisibleMusicTrack(track) &&
    getMusicTrackPlaybackUnavailableReason(track, canPlayType) === null
  );
}

export function getMusicTrackPlaybackUnavailableReason(
  track: MusicTrack,
  canPlayType?: AudioCanPlayType | null,
): MusicTrackPlaybackUnavailableReason | null {
  const resolvedCanPlayType =
    typeof canPlayType === "function" || canPlayType === null
      ? canPlayType
      : undefined;

  if (!isAvailableMusicTrack(track)) {
    return "disabled";
  }

  if (!canPlayAudioSource(track.audioUrl, resolvedCanPlayType)) {
    return "unsupported-format";
  }

  return null;
}

export function formatMusicTrackPlaybackUnavailableMessage(
  reason: MusicTrackPlaybackUnavailableReason,
): string {
  if (reason === "disabled") {
    return "비활성화된 곡은 재생할 수 없습니다.";
  }

  return "현재 브라우저에서 지원하지 않는 오디오 형식입니다. MP3 등 지원되는 파일로 교체해 주세요.";
}

export function isSupportedAudioUrl(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function readRequiredString(
  input: Record<string, unknown>,
  key: string,
  index: number,
  errors: string[],
): string | null {
  const value = input[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`Track at index ${index} is missing required field "${key}".`);
    return null;
  }

  return value.trim();
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function readOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function readOptionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const tags = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : undefined;
}

function readOptionalEnergyLevel(value: unknown): EnergyLevel | undefined {
  return typeof value === "string" && energyLevels.has(value as EnergyLevel)
    ? (value as EnergyLevel)
    : undefined;
}

function describeTrack(id: string | null, index: number): string {
  return id ? `"${id}"` : `at index ${index}`;
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
