export type BaseTrack = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  src: string;
};

/** Track used by the DJ Play List page, which also accepts local file uploads. */
export type Track = BaseTrack & {
  /** true when the src is a local Object URL that we own and must revoke */
  isObjectUrl?: boolean;
};

/** Track used by the dated Music List page, numbered within its playlist. */
export type PlaylistTrack = BaseTrack & {
  number: number;
};
