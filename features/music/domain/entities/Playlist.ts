export type PlaylistTrackSource = {
  id: string;
  number: number;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  audioPath: string;
};

export type PlaylistSource = {
  date: string;
  label: string;
  description: string;
  tracks: PlaylistTrackSource[];
};
