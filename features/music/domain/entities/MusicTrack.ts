export type RepeatMode = "none" | "one" | "all";

export type EnergyLevel = "low" | "medium" | "high";

export type MusicTrack = {
  id: string;
  artist: string;
  title: string;
  audioUrl: string;
  bpm?: number;
  musicType?: string;
  duration?: number;
  tags?: string[];
  source?: string;
  description?: string;
  album?: string;
  year?: number;
  genre?: string;
  danceType?: string;
  energyLevel?: EnergyLevel;
  isFavorite?: boolean;
  isAvailable?: boolean;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
