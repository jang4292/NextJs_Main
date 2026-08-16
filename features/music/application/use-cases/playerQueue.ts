import type {
  MusicTrack,
  RepeatMode,
} from "@/features/music/domain/entities/MusicTrack";
import { isPlayableMusicTrack, isVisibleMusicTrack } from "./musicValidation";

export type PlaybackStepReason = "manual" | "ended";

export type NextTrackInput = {
  tracks: readonly MusicTrack[];
  currentTrackId: string | null;
  repeatMode: RepeatMode;
  shuffle: boolean;
  reason: PlaybackStepReason;
  random?: () => number;
};

export function getVisibleTracks(tracks: readonly MusicTrack[]): MusicTrack[] {
  return tracks.filter(isVisibleMusicTrack);
}

export function getPlayableTracks(tracks: readonly MusicTrack[]): MusicTrack[] {
  return tracks.filter((track) => isPlayableMusicTrack(track));
}

export function resolvePlaybackTracks(
  tracks: readonly MusicTrack[],
  selectedTrackIds: readonly string[],
): MusicTrack[] {
  const playableTracks = getPlayableTracks(tracks);

  if (selectedTrackIds.length === 0) {
    return playableTracks;
  }

  const selectedIds = new Set(selectedTrackIds);
  return playableTracks.filter((track) => selectedIds.has(track.id));
}

export function getNextTrackId({
  tracks,
  currentTrackId,
  repeatMode,
  shuffle,
  reason,
  random = Math.random,
}: NextTrackInput): string | null {
  if (tracks.length === 0) {
    return null;
  }

  if (reason === "ended" && repeatMode === "one" && currentTrackId) {
    return currentTrackId;
  }

  if (shuffle) {
    return getRandomTrackIdAvoidingCurrent(tracks, currentTrackId, random);
  }

  const currentIndex = tracks.findIndex((track) => track.id === currentTrackId);
  const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;

  if (nextIndex < tracks.length) {
    return tracks[nextIndex].id;
  }

  if (reason === "ended" && repeatMode === "none") {
    return null;
  }

  return tracks[0].id;
}

export function getPreviousTrackId(
  tracks: readonly MusicTrack[],
  currentTrackId: string | null,
): string | null {
  if (tracks.length === 0) {
    return null;
  }

  const currentIndex = tracks.findIndex((track) => track.id === currentTrackId);

  if (currentIndex <= 0) {
    return tracks[tracks.length - 1].id;
  }

  return tracks[currentIndex - 1].id;
}

export function getRandomTrackIdAvoidingCurrent(
  tracks: readonly MusicTrack[],
  currentTrackId: string | null,
  random: () => number = Math.random,
): string | null {
  if (tracks.length === 0) {
    return null;
  }

  const candidates =
    tracks.length > 1
      ? tracks.filter((track) => track.id !== currentTrackId)
      : tracks;
  const randomIndex = Math.floor(random() * candidates.length);

  return candidates[Math.min(randomIndex, candidates.length - 1)].id;
}

export function shuffleMusicTracks(
  tracks: readonly MusicTrack[],
  random: () => number = Math.random,
): MusicTrack[] {
  const shuffled = [...tracks];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}
