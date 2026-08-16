export type BaseTrack = {
  id: string;
  songId?: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  src: string;
  number?: number;
  sourcePlaylistDate?: string;
  sourcePlaylistLabel?: string;
  sourceTrackId?: string;
};

/** Playable music track, including uploaded local files. */
export type Track = BaseTrack & {
  /** false when the track is listed but its audio URL is intentionally pending */
  isAvailable?: boolean;
  /** true when the src is a local Object URL that we own and must revoke */
  isObjectUrl?: boolean;
};

/** Track used by the dated Music List page, numbered within its playlist. */
export type PlaylistTrack = Track & {
  number: number;
};
