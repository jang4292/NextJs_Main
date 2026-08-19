import { describe, expect, it } from "vitest";
import { MUSIC_SONG_CATALOG } from "../../domain/data/musicCatalog";
import { MUSIC_PLAYLIST_SOURCES } from "../../domain/data/musicPlaylists";
import {
  getPlaylistByDate,
  hydratePlaylist,
  resolveSelectedPlaylist,
} from "./playlists";

describe("music-list playlists", () => {
  it("keeps playlist source data tied to catalog song IDs", () => {
    expect(MUSIC_PLAYLIST_SOURCES[0].tracks[0]).toMatchObject({
      id: "1-1",
      number: 1,
      songId: "artie-shaw-non-stop-flight",
    });
    expect(MUSIC_PLAYLIST_SOURCES[0].tracks[0]).not.toHaveProperty("title");
    expect(MUSIC_PLAYLIST_SOURCES[0].tracks[0]).not.toHaveProperty("artist");
    expect(MUSIC_PLAYLIST_SOURCES[0].tracks[0]).not.toHaveProperty("src");
  });

  it("hydrates playlist tracks from the song catalog", () => {
    const playlist = hydratePlaylist(MUSIC_PLAYLIST_SOURCES[0]);

    expect(playlist.tracks[0]).toMatchObject({
      id: "1-1",
      songId: "artie-shaw-non-stop-flight",
      number: 1,
      title: "Non Stop Flight",
      artist: "Artie Shaw",
      bpm: 200,
      genre: "Swing Jazz - Balboa",
      sourcePlaylistDate: "2025-01-10",
      sourcePlaylistLabel: "2025년 1월 10일",
      sourceTrackId: "1-1",
    });
    expect(playlist.tracks[0].src).toContain("Non+Stop+Flight.flac");
  });

  it("keeps all playlist song IDs backed by the catalog", () => {
    const catalogIds = new Set(MUSIC_SONG_CATALOG.map((song) => song.songId));

    expect(
      MUSIC_PLAYLIST_SOURCES.flatMap((playlist) => playlist.tracks).every(
        (track) => catalogIds.has(track.songId),
      ),
    ).toBe(true);
  });

  it("falls back to the first playlist when the selected date is unknown", () => {
    const playlist = resolveSelectedPlaylist(
      MUSIC_PLAYLIST_SOURCES.map(hydratePlaylist),
      "2099-01-01",
    );

    expect(playlist.date).toBe("2025-01-10");
  });

  it("adds the October 22 DJ history through catalog references", () => {
    const playlist = getPlaylistByDate("2025-10-22");

    expect(playlist).toBeDefined();
    expect(playlist?.description).toBe(
      "서울 합정 더쏘셜클럽 수요일 소셜 발보아 DJ",
    );
    expect(playlist?.tracks).toHaveLength(56);

    const pendingTrack = playlist?.tracks[0];
    expect(pendingTrack).toMatchObject({
      songId: "jimmy-tommy-dorsey-well-git-it",
      title: "Well, Git It!",
      src: "",
      isAvailable: false,
    });

    const catalogMatchedTrack = playlist?.tracks.find(
      (track) => track.id === "113-23",
    );
    expect(catalogMatchedTrack).toMatchObject({
      songId: "hot-sugar-band-little-brown-jug",
      title: "Little Brown Jug",
      bpm: 195,
    });
    expect(catalogMatchedTrack?.src).toContain("Little+Brown+Jug.mp3");
  });
});
