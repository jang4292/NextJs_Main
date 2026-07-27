import type { Track } from "@/types/track";
import type { Playlist } from "./playlists";
import { PLAYLISTS } from "./playlists";

export function toPlayableTrack(track: Track): Track {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    bpm: track.bpm,
    genre: track.genre,
    src: track.src,
    isObjectUrl: track.isObjectUrl,
  };
}

export function createQueueFromPlaylist(playlist: Playlist): Track[] {
  return playlist.tracks.map(toPlayableTrack);
}

export function createDefaultDjTracks(): Track[] {
  const fallbackPlaylist = PLAYLISTS[0];

  if (!fallbackPlaylist) {
    return [];
  }

  return createQueueFromPlaylist(fallbackPlaylist);
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
