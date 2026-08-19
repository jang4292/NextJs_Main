import { audioUrl } from "@/lib/audio";
import type { PlaylistTrack } from "@/types/track";
import { MUSIC_SONG_CATALOG } from "../../domain/data/musicCatalog";
import { MUSIC_PLAYLIST_SOURCES } from "../../domain/data/musicPlaylists";
import type {
  PlaylistSource,
  SongCatalogItem,
} from "../../domain/entities/Playlist";

export type Track = PlaylistTrack;

export type Playlist = {
  date: string;
  label: string;
  description: string;
  tracks: Track[];
};

const SONG_CATALOG_BY_ID = new Map(
  MUSIC_SONG_CATALOG.map((song) => [song.songId, song]),
);

export function hydratePlaylist(source: PlaylistSource): Playlist {
  return {
    date: source.date,
    label: source.label,
    description: source.description,
    tracks: source.tracks.map((track) => {
      const song = resolveSong(track.songId);

      return {
        id: track.id,
        songId: song.songId,
        number: track.number,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,
        genre: song.genre,
        sourcePlaylistDate: source.date,
        sourcePlaylistLabel: source.label,
        sourceTrackId: track.id,
        ...(song.audioPath
          ? { src: audioUrl(song.audioPath) }
          : { src: "", isAvailable: false }),
      };
    }),
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

function resolveSong(songId: string): SongCatalogItem {
  const song = SONG_CATALOG_BY_ID.get(songId);

  if (!song) {
    throw new Error(`Unknown music songId: ${songId}`);
  }

  return song;
}
