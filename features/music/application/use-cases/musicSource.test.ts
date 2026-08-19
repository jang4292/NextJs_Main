import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCAL_MUSIC_JSON_URL,
  resolveMusicSourceConfig,
  resolveMusicSourceMode,
} from "./musicSource";

describe("music source config", () => {
  it("defaults to the local JSON source", () => {
    expect(resolveMusicSourceMode(undefined)).toBe("local");
    expect(resolveMusicSourceConfig({})).toEqual({
      mode: "local",
      url: DEFAULT_LOCAL_MUSIC_JSON_URL,
    });
  });

  it("uses a custom local JSON URL in local mode", () => {
    expect(
      resolveMusicSourceConfig({
        NEXT_PUBLIC_MUSIC_SOURCE_MODE: "local",
        NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL: "/custom/music.json",
      }),
    ).toEqual({
      mode: "local",
      url: "/custom/music.json",
    });
  });

  it("uses the remote JSON URL in remote mode", () => {
    expect(
      resolveMusicSourceConfig({
        NEXT_PUBLIC_MUSIC_SOURCE_MODE: "remote",
        NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL: "/data/music-list.json",
        NEXT_PUBLIC_REMOTE_MUSIC_JSON_URL:
          "https://example.com/music-list.json",
      }),
    ).toEqual({
      mode: "remote",
      url: "https://example.com/music-list.json",
    });
  });

  it("falls back to the local URL when remote mode has no remote URL yet", () => {
    expect(
      resolveMusicSourceConfig({
        NEXT_PUBLIC_MUSIC_SOURCE_MODE: "remote",
        NEXT_PUBLIC_LOCAL_MUSIC_JSON_URL: "/data/music-list.json",
      }),
    ).toEqual({
      mode: "remote",
      url: "/data/music-list.json",
    });
  });
});
