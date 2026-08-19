import type { Track } from "@/types/track";
import { canPlayAudioSource, type AudioCanPlayType } from "./audioSupport";
import type { Playlist } from "./playlists";

export type TrackIdFactory = () => string;

export type TrackPlaybackUnavailableReason =
  "pending-url" | "unsupported-format";

export type CustomQueueDuplicateSummary = {
  sameSourceTracks: Track[];
  sameSongTracks: Track[];
};

export function toPlayableTrack(track: Track): Track {
  return {
    id: track.id,
    songId: track.songId,
    title: track.title,
    artist: track.artist,
    bpm: track.bpm,
    genre: track.genre,
    src: track.src,
    isAvailable: track.isAvailable,
    isObjectUrl: track.isObjectUrl,
    sourcePlaylistDate: track.sourcePlaylistDate,
    sourcePlaylistLabel: track.sourcePlaylistLabel,
    sourceTrackId: track.sourceTrackId,
  };
}

export function createCustomQueueTrackFromHistory(
  track: Track,
  createId: TrackIdFactory = createTrackId,
): Track {
  return {
    ...toPlayableTrack(track),
    id: createId(),
    sourceTrackId: track.sourceTrackId ?? track.id,
  };
}

export function createCustomQueueFromHistory(
  playlist: Playlist,
  createId: TrackIdFactory = createTrackId,
): Track[] {
  return playlist.tracks.map((track) =>
    createCustomQueueTrackFromHistory(track, createId),
  );
}

export function createEmptyCustomQueue(): Track[] {
  return [];
}

export function isPlayableTrack(
  track: Track,
  canPlayType?: AudioCanPlayType | null,
): boolean {
  return getTrackPlaybackUnavailableReason(track, canPlayType) === null;
}

export function getTrackPlaybackUnavailableReason(
  track: Track,
  canPlayType?: AudioCanPlayType | null,
): TrackPlaybackUnavailableReason | null {
  const resolvedCanPlayType =
    typeof canPlayType === "function" || canPlayType === null
      ? canPlayType
      : undefined;

  if (track.src.trim().length === 0 || track.isAvailable === false) {
    return "pending-url";
  }

  if (!canPlayAudioSource(track.src, resolvedCanPlayType)) {
    return "unsupported-format";
  }

  return null;
}

export function formatTrackPlaybackUnavailableMessage(
  reason: TrackPlaybackUnavailableReason,
): string {
  if (reason === "pending-url") {
    return "음원 URL이 아직 등록되지 않은 트랙입니다.";
  }

  return "현재 브라우저에서 지원하지 않는 오디오 형식입니다. MP3 등 지원되는 파일로 교체해 주세요.";
}

export function createTrackId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function findCustomQueueDuplicates(
  queueTracks: readonly Track[],
  track: Track,
): CustomQueueDuplicateSummary {
  const sourcePlaylistDate = track.sourcePlaylistDate;
  const sourceTrackId = track.sourceTrackId ?? track.id;
  const sameSourceTracks =
    sourcePlaylistDate && sourceTrackId
      ? queueTracks.filter(
          (queueTrack) =>
            queueTrack.sourcePlaylistDate === sourcePlaylistDate &&
            queueTrack.sourceTrackId === sourceTrackId,
        )
      : [];
  const sameSourceIds = new Set(sameSourceTracks.map((item) => item.id));
  const sameSongTracks = track.songId
    ? queueTracks.filter(
        (queueTrack) =>
          queueTrack.songId === track.songId &&
          !sameSourceIds.has(queueTrack.id),
      )
    : [];

  return {
    sameSourceTracks,
    sameSongTracks,
  };
}

export function hasCustomQueueDuplicates(
  summary: CustomQueueDuplicateSummary,
): boolean {
  return (
    summary.sameSourceTracks.length > 0 || summary.sameSongTracks.length > 0
  );
}

export function formatCustomQueueDuplicateMessage(
  track: Track,
  summary: CustomQueueDuplicateSummary,
): string {
  const messages = [`"${track.title}"은(는) 이미 Custom Queue에 있습니다.`];

  if (summary.sameSourceTracks.length > 0) {
    messages.push("같은 날짜의 같은 히스토리 항목이 이미 추가되어 있습니다.");
  }

  if (summary.sameSongTracks.length > 0) {
    const sourceLabels = Array.from(
      new Set(
        summary.sameSongTracks
          .map((duplicate) => duplicate.sourcePlaylistLabel)
          .filter((label): label is string => Boolean(label)),
      ),
    );
    const sourceText =
      sourceLabels.length > 0
        ? ` (${sourceLabels.slice(0, 3).join(", ")})`
        : "";

    messages.push(
      `다른 날짜 또는 항목의 동일 음원이 이미 추가되어 있습니다${sourceText}.`,
    );
  }

  messages.push("그래도 다시 추가할까요?");

  return messages.join("\n");
}

export function createUrlTrack({
  id,
  url,
  title,
  artist,
}: {
  id: string;
  url: string;
  title: string;
  artist: string;
}): Track {
  return {
    id,
    bpm: 0,
    title: title.trim() || url,
    artist: artist.trim() || "Unknown",
    genre: "URL",
    src: url,
  };
}

export function validateHttpsAudioUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("URL을 입력하세요. / Please enter a URL.");
  }

  const parsed = new URL(trimmed);
  if (parsed.protocol !== "https:") {
    throw new Error("https URL만 허용됩니다. / Only https URLs are allowed.");
  }

  return parsed.href;
}
