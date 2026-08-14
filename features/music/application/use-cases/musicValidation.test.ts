import { describe, expect, it } from "vitest";
import {
  isAvailableMusicTrack,
  isPlayableMusicTrack,
  isSupportedAudioUrl,
  isVisibleMusicTrack,
  parseMusicTrackList,
} from "./musicValidation";

describe("music JSON validation", () => {
  it("parses valid tracks and counts hidden and unavailable items", () => {
    const result = parseMusicTrackList([
      {
        id: "track-1",
        artist: "Artist",
        title: "Song",
        audioUrl: "https://example.com/song.mp3",
        bpm: 190,
        tags: ["balboa", "swing"],
      },
      {
        id: "track-2",
        artist: "Artist",
        title: "Hidden song",
        audioUrl: "/audio/hidden.mp3",
        isVisible: false,
      },
      {
        id: "track-3",
        artist: "Artist",
        title: "Disabled song",
        audioUrl: "https://example.com/disabled.mp3",
        isAvailable: false,
      },
    ]);

    expect(result.errors).toEqual([]);
    expect(result.tracks).toHaveLength(3);
    expect(result.hiddenCount).toBe(1);
    expect(result.unavailableCount).toBe(1);
    expect(isVisibleMusicTrack(result.tracks[1])).toBe(false);
    expect(isAvailableMusicTrack(result.tracks[2])).toBe(false);
    expect(isPlayableMusicTrack(result.tracks[0])).toBe(true);
  });

  it("rejects missing required fields and unsupported audio URLs", () => {
    const result = parseMusicTrackList([
      {
        id: "track-1",
        artist: "Artist",
        audioUrl: "https://example.com/song.mp3",
      },
      {
        id: "track-2",
        artist: "Artist",
        title: "Song",
        audioUrl: "not-a-url",
      },
    ]);

    expect(result.tracks).toEqual([]);
    expect(result.errors).toEqual([
      'Track at index 0 is missing required field "title".',
      'Track "track-2" has an unsupported audioUrl.',
    ]);
  });

  it("accepts absolute http(s) and root-relative audio URLs", () => {
    expect(isSupportedAudioUrl("https://example.com/song.mp3")).toBe(true);
    expect(isSupportedAudioUrl("http://example.com/song.mp3")).toBe(true);
    expect(isSupportedAudioUrl("/audio/song.mp3")).toBe(true);
    expect(isSupportedAudioUrl("audio/song.mp3")).toBe(false);
  });
});
