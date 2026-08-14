export type MusicSourceMode = "local" | "remote";

export type MusicSourceConfig = {
  mode: MusicSourceMode;
  url: string;
};

export type MusicSourceEnv = {
  NEXT_PUBLIC_MUSIC_SOURCE_MODE?: string;
  NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL?: string;
  NEXT_PUBLIC_REMOTE_MUSIC_JSON_URL?: string;
};

export const DEFAULT_LOCAL_MUSIC_JSON_URL = "/data/music-list.json";

export function resolveMusicSourceMode(value?: string): MusicSourceMode {
  return value === "remote" ? "remote" : "local";
}

export function resolveMusicSourceConfig(
  env: MusicSourceEnv,
): MusicSourceConfig {
  const mode = resolveMusicSourceMode(env.NEXT_PUBLIC_MUSIC_SOURCE_MODE);
  const localUrl =
    env.NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL?.trim() ||
    DEFAULT_LOCAL_MUSIC_JSON_URL;
  const remoteUrl = env.NEXT_PUBLIC_REMOTE_MUSIC_JSON_URL?.trim();

  return {
    mode,
    url: mode === "remote" ? remoteUrl || localUrl : localUrl,
  };
}

export function getConfiguredMusicSource(): MusicSourceConfig {
  return resolveMusicSourceConfig({
    NEXT_PUBLIC_MUSIC_SOURCE_MODE: process.env.NEXT_PUBLIC_MUSIC_SOURCE_MODE,
    NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL:
      process.env.NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL,
    NEXT_PUBLIC_REMOTE_MUSIC_JSON_URL:
      process.env.NEXT_PUBLIC_REMOTE_MUSIC_JSON_URL,
  });
}
