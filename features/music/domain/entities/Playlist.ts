export type SongCatalogItem = {
  songId: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  audioPath?: string;
};

export type PlaylistTrackSource = {
  id: string;
  number: number;
  songId: string;
};

export type PlaylistSource = {
  date: string;
  label: string;
  description: string;
  tracks: PlaylistTrackSource[];
};
