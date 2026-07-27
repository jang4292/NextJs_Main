import { audioUrl } from "@/lib/audio";
import type { PlaylistTrack } from "@/types/track";
import { MUSIC_PLAYLIST_SOURCES } from "../../domain/data/musicPlaylists";
import type { PlaylistSource } from "../../domain/entities/Playlist";

export type Track = PlaylistTrack;

export type Playlist = {
  date: string;
  label: string;
  description: string;
  tracks: Track[];
};

export function hydratePlaylist(source: PlaylistSource): Playlist {
  return {
    date: source.date,
    label: source.label,
    description: source.description,
    tracks: source.tracks.map(({ audioPath, ...track }) => ({
      ...track,
      src: audioUrl(audioPath),
    })),
  };
}

export const PLAYLISTS: Playlist[] =
  MUSIC_PLAYLIST_SOURCES.map(hydratePlaylist);

export function getPlaylistByDate(date: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.date === date);
}

export function getAllDates(): string[] {
  return PLAYLISTS.map((p) => p.date);
}

export function resolveSelectedPlaylist(
  playlists: readonly Playlist[],
  selectedDate: string,
): Playlist {
  const fallback = playlists[0];
  const playlist = playlists.find((p) => p.date === selectedDate);

  if (!playlist && !fallback) {
    throw new Error("At least one music playlist is required.");
  }

  return playlist ?? fallback;
}
