import { describe, expect, it } from "vitest";
import {
  createDefaultDjTracks,
  createQueueFromPlaylist,
  createUrlTrack,
  validateHttpsAudioUrl,
} from "./tracks";
import { PLAYLISTS } from "./playlists";

describe("music tracks", () => {
  it("derives the default DJ queue from the canonical first playlist", () => {
    const defaultTracks = createDefaultDjTracks();

    expect(defaultTracks).toHaveLength(PLAYLISTS[0].tracks.length);
    expect(defaultTracks[0]).toMatchObject({
      id: PLAYLISTS[0].tracks[0].id,
      title: PLAYLISTS[0].tracks[0].title,
      src: PLAYLISTS[0].tracks[0].src,
    });
    expect(defaultTracks[0]).not.toHaveProperty("number");
  });

  it("creates mutable queue tracks without playlist-only numbering", () => {
    expect(createQueueFromPlaylist(PLAYLISTS[0])[0]).not.toHaveProperty(
      "number",
    );
  });

  it("accepts and normalizes https track URLs", () => {
    expect(validateHttpsAudioUrl(" https://example.com/song.mp3 ")).toBe(
      "https://example.com/song.mp3",
    );
  });

  it("rejects non-https track URLs", () => {
    expect(() => validateHttpsAudioUrl("http://example.com/song.mp3")).toThrow(
      "https URL만 허용됩니다.",
    );
  });

  it("creates URL tracks with sensible title and artist fallbacks", () => {
    expect(
      createUrlTrack({
        id: "track-1",
        url: "https://example.com/song.mp3",
        title: "",
        artist: "",
      }),
    ).toMatchObject({
      id: "track-1",
      title: "https://example.com/song.mp3",
      artist: "Unknown",
      genre: "URL",
      src: "https://example.com/song.mp3",
    });
  });
});
