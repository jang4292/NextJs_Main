import { describe, expect, it } from "vitest";
import {
  createCustomQueueFromHistory,
  createCustomQueueTrackFromHistory,
  createEmptyCustomQueue,
  createUrlTrack,
  findCustomQueueDuplicates,
  formatCustomQueueDuplicateMessage,
  hasCustomQueueDuplicates,
  isPlayableTrack,
  validateHttpsAudioUrl,
} from "./tracks";
import { getPlaylistByDate, PLAYLISTS } from "./playlists";

describe("music tracks", () => {
  it("starts the custom queue empty", () => {
    expect(createEmptyCustomQueue()).toEqual([]);
  });

  it("copies DJ history tracks into mutable custom queue tracks", () => {
    const queueTracks = createCustomQueueFromHistory(
      PLAYLISTS[0],
      createSequentialIdFactory("queue"),
    );

    expect(queueTracks).toHaveLength(PLAYLISTS[0].tracks.length);
    expect(queueTracks[0]).toMatchObject({
      id: "queue-1",
      songId: PLAYLISTS[0].tracks[0].songId,
      title: PLAYLISTS[0].tracks[0].title,
      src: PLAYLISTS[0].tracks[0].src,
      sourcePlaylistDate: "2025-01-10",
      sourcePlaylistLabel: "2025년 1월 10일",
      sourceTrackId: "1-1",
    });
    expect(queueTracks[0].id).not.toBe(PLAYLISTS[0].tracks[0].id);
    expect(queueTracks[0]).not.toHaveProperty("number");
  });

  it("creates custom queue tracks without history-only numbering", () => {
    expect(
      createCustomQueueFromHistory(
        PLAYLISTS[0],
        createSequentialIdFactory("queue"),
      )[0],
    ).not.toHaveProperty("number");
  });

  it("creates a single custom queue track from a DJ history track", () => {
    const queueTrack = createCustomQueueTrackFromHistory(
      PLAYLISTS[0].tracks[1],
      () => "queue-single",
    );

    expect(queueTrack).toMatchObject({
      id: "queue-single",
      songId: "hot-sugar-band-little-brown-jug",
      title: "Little Brown Jug",
      sourceTrackId: "1-2",
    });
    expect(queueTrack).not.toHaveProperty("number");
  });

  it("keeps pending audio state when copying DJ history into the custom queue", () => {
    const playlist = getPlaylistByDate("2025-10-22");

    expect(playlist).toBeDefined();

    const queueTracks = createCustomQueueFromHistory(
      playlist!,
      createSequentialIdFactory("queue"),
    );

    expect(queueTracks).toHaveLength(56);
    expect(queueTracks[0]).toMatchObject({
      id: "queue-1",
      songId: "jimmy-tommy-dorsey-well-git-it",
      title: "Well, Git It!",
      src: "",
      isAvailable: false,
      sourceTrackId: "113-1",
    });
    expect(queueTracks[0]).not.toHaveProperty("number");
  });

  it("detects tracks with pending audio URLs as not playable", () => {
    expect(isPlayableTrack(PLAYLISTS[0].tracks[0])).toBe(true);
    expect(isPlayableTrack(getPlaylistByDate("2025-10-22")!.tracks[0])).toBe(
      false,
    );
  });

  it("detects browser-unsupported audio formats as not playable", () => {
    expect(
      isPlayableTrack(
        {
          id: "flac-track",
          bpm: 180,
          title: "FLAC Song",
          artist: "Artist",
          genre: "Audio",
          src: "https://example.com/song.flac",
        },
        mp3OnlyCanPlayType,
      ),
    ).toBe(false);
  });

  it("keeps browser-supported MP3 URLs playable", () => {
    expect(
      isPlayableTrack(
        {
          id: "mp3-track",
          bpm: 180,
          title: "MP3 Song",
          artist: "Artist",
          genre: "Audio",
          src: "https://example.com/song.mp3",
        },
        mp3OnlyCanPlayType,
      ),
    ).toBe(true);
  });

  it("detects the same DJ history item already in the custom queue", () => {
    const sourceTrack = PLAYLISTS[0].tracks[1];
    const queueTrack = createCustomQueueTrackFromHistory(
      sourceTrack,
      () => "queue-track",
    );
    const duplicates = findCustomQueueDuplicates([queueTrack], sourceTrack);

    expect(duplicates.sameSourceTracks).toEqual([queueTrack]);
    expect(duplicates.sameSongTracks).toEqual([]);
    expect(hasCustomQueueDuplicates(duplicates)).toBe(true);
  });

  it("detects the same song from a different playlist date", () => {
    const queueTrack = createCustomQueueTrackFromHistory(
      PLAYLISTS[0].tracks[1],
      () => "queue-track",
    );
    const duplicates = findCustomQueueDuplicates(
      [queueTrack],
      PLAYLISTS[1].tracks[0],
    );

    expect(duplicates.sameSourceTracks).toEqual([]);
    expect(duplicates.sameSongTracks).toEqual([queueTrack]);
    expect(
      formatCustomQueueDuplicateMessage(PLAYLISTS[1].tracks[0], duplicates),
    ).toContain("다른 날짜 또는 항목의 동일 음원");
  });

  it("detects the same song from a different occurrence on the same date", () => {
    const octoberPlaylist = getPlaylistByDate("2025-10-22")!;
    const firstDinah = octoberPlaylist.tracks.find(
      (track) => track.id === "113-29",
    )!;
    const secondDinah = octoberPlaylist.tracks.find(
      (track) => track.id === "113-52",
    )!;
    const queueTrack = createCustomQueueTrackFromHistory(
      firstDinah,
      () => "queue-track",
    );
    const duplicates = findCustomQueueDuplicates([queueTrack], secondDinah);

    expect(duplicates.sameSourceTracks).toEqual([]);
    expect(duplicates.sameSongTracks).toEqual([queueTrack]);
  });

  it("ignores URL tracks without catalog song IDs for duplicate checks", () => {
    const queueTrack = createUrlTrack({
      id: "url-queue",
      url: "https://example.com/song.mp3",
      title: "Song",
      artist: "Artist",
    });
    const targetTrack = createUrlTrack({
      id: "url-target",
      url: "https://example.com/song.mp3",
      title: "Song",
      artist: "Artist",
    });

    expect(
      hasCustomQueueDuplicates(
        findCustomQueueDuplicates([queueTrack], targetTrack),
      ),
    ).toBe(false);
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

function createSequentialIdFactory(prefix: string): () => string {
  let count = 0;

  return () => `${prefix}-${++count}`;
}

function mp3OnlyCanPlayType(mimeType: string): CanPlayTypeResult {
  return mimeType === "audio/mpeg" || mimeType === "audio/mp3"
    ? "probably"
    : "";
}
