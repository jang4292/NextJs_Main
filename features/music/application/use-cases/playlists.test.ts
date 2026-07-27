import { describe, expect, it } from "vitest";
import { MUSIC_PLAYLIST_SOURCES } from "../../domain/data/musicPlaylists";
import { hydratePlaylist, resolveSelectedPlaylist } from "./playlists";

describe("music-list playlists", () => {
  it("keeps source data independent from resolved audio URLs", () => {
    expect(MUSIC_PLAYLIST_SOURCES[0].tracks[0]).toHaveProperty("audioPath");
    expect(MUSIC_PLAYLIST_SOURCES[0].tracks[0]).not.toHaveProperty("src");
  });

  it("hydrates playlist audio paths into playable src values", () => {
    const playlist = hydratePlaylist(MUSIC_PLAYLIST_SOURCES[0]);

    expect(playlist.tracks[0].src).toContain(
      "SwingJazz/%5B200%5D+Artie+Shaw+-+Non+Stop+Flight.flac",
    );
  });

  it("falls back to the first playlist when the selected date is unknown", () => {
    const playlist = resolveSelectedPlaylist(
      MUSIC_PLAYLIST_SOURCES.map(hydratePlaylist),
      "2099-01-01",
    );

    expect(playlist.date).toBe("2025-01-10");
  });
});
