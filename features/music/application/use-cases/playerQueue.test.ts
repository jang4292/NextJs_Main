import { describe, expect, it } from "vitest";
import type { MusicTrack } from "@/features/music/domain/entities/MusicTrack";
import {
  getNextTrackId,
  getPlayableTracks,
  getPreviousTrackId,
  getRandomTrackIdAvoidingCurrent,
  getVisibleTracks,
  resolvePlaybackTracks,
  shuffleMusicTracks,
} from "./playerQueue";

const tracks: MusicTrack[] = [
  {
    id: "track-1",
    artist: "Artist",
    title: "One",
    audioUrl: "https://example.com/one.mp3",
  },
  {
    id: "track-2",
    artist: "Artist",
    title: "Two",
    audioUrl: "https://example.com/two.mp3",
  },
  {
    id: "track-3",
    artist: "Artist",
    title: "Three",
    audioUrl: "https://example.com/three.mp3",
    isAvailable: false,
  },
  {
    id: "track-4",
    artist: "Artist",
    title: "Hidden",
    audioUrl: "https://example.com/hidden.mp3",
    isVisible: false,
  },
];

describe("music player queue policies", () => {
  it("separates visible tracks from playable tracks", () => {
    expect(getVisibleTracks(tracks).map((track) => track.id)).toEqual([
      "track-1",
      "track-2",
      "track-3",
    ]);
    expect(getPlayableTracks(tracks).map((track) => track.id)).toEqual([
      "track-1",
      "track-2",
    ]);
  });

  it("uses selected tracks when a selection exists", () => {
    expect(
      resolvePlaybackTracks(tracks, ["track-2", "track-3"]).map(
        (track) => track.id,
      ),
    ).toEqual(["track-2"]);
  });

  it("falls back to all playable tracks when there is no selection", () => {
    expect(resolvePlaybackTracks(tracks, []).map((track) => track.id)).toEqual([
      "track-1",
      "track-2",
    ]);
  });

  it("applies repeat policies when a track ends", () => {
    const playableTracks = getPlayableTracks(tracks);

    expect(
      getNextTrackId({
        tracks: playableTracks,
        currentTrackId: "track-2",
        repeatMode: "none",
        shuffle: false,
        reason: "ended",
      }),
    ).toBeNull();

    expect(
      getNextTrackId({
        tracks: playableTracks,
        currentTrackId: "track-2",
        repeatMode: "all",
        shuffle: false,
        reason: "ended",
      }),
    ).toBe("track-1");

    expect(
      getNextTrackId({
        tracks: playableTracks,
        currentTrackId: "track-2",
        repeatMode: "one",
        shuffle: false,
        reason: "ended",
      }),
    ).toBe("track-2");
  });

  it("wraps manual previous and next navigation", () => {
    const playableTracks = getPlayableTracks(tracks);

    expect(
      getNextTrackId({
        tracks: playableTracks,
        currentTrackId: "track-2",
        repeatMode: "none",
        shuffle: false,
        reason: "manual",
      }),
    ).toBe("track-1");
    expect(getPreviousTrackId(playableTracks, "track-1")).toBe("track-2");
  });

  it("avoids replaying the current track in random mode when alternatives exist", () => {
    expect(
      getRandomTrackIdAvoidingCurrent(
        getPlayableTracks(tracks),
        "track-1",
        () => 0,
      ),
    ).toBe("track-2");
  });

  it("allows the current track in random mode when it is the only candidate", () => {
    expect(getRandomTrackIdAvoidingCurrent([tracks[0]], "track-1")).toBe(
      "track-1",
    );
  });

  it("shuffles the list order without mutating the original tracks", () => {
    const originalIds = tracks.map((track) => track.id);
    const shuffledIds = shuffleMusicTracks(tracks, () => 0).map(
      (track) => track.id,
    );

    expect(tracks.map((track) => track.id)).toEqual(originalIds);
    expect(shuffledIds).toEqual(["track-2", "track-3", "track-4", "track-1"]);
  });
});
