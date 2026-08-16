"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MusicTrack } from "@/features/music/domain/entities/MusicTrack";
import {
  getConfiguredMusicSource,
  type MusicSourceConfig,
} from "@/features/music/application/use-cases/musicSource";
import { getVisibleTracks } from "@/features/music/application/use-cases/playerQueue";
import { parseMusicTrackList } from "@/features/music/application/use-cases/musicValidation";

export type TrackSourceState = {
  config: MusicSourceConfig;
  tracks: MusicTrack[];
  sourceTracks: MusicTrack[];
  loading: boolean;
  error: string;
  validationErrors: string[];
  hiddenCount: number;
  unavailableCount: number;
  refresh: () => void;
};

export function useTrackSource(): TrackSourceState {
  const config = useMemo(() => getConfiguredMusicSource(), []);
  const [reloadKey, setReloadKey] = useState(0);
  const [sourceTracks, setSourceTracks] = useState<MusicTrack[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [unavailableCount, setUnavailableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    async function loadTracks() {
      setLoading(true);
      setError("");
      setValidationErrors([]);

      try {
        const response = await fetch(config.url, {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Music JSON fetch failed with status ${response.status}.`,
          );
        }

        const text = await response.text();
        let payload: unknown;

        try {
          payload = JSON.parse(text);
        } catch {
          throw new Error("Music JSON could not be parsed.");
        }

        const result = parseMusicTrackList(payload);
        setSourceTracks(result.tracks);
        setValidationErrors(result.errors);
        setHiddenCount(result.hiddenCount);
        setUnavailableCount(result.unavailableCount);

        if (result.tracks.length === 0 && result.errors.length > 0) {
          setError(result.errors.join(" "));
        }
      } catch (caughtError) {
        if (abortController.signal.aborted) {
          return;
        }

        setSourceTracks([]);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Music JSON could not be loaded.",
        );
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTracks();

    return () => {
      abortController.abort();
    };
  }, [config.url, reloadKey]);

  const refresh = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  return {
    config,
    tracks: getVisibleTracks(sourceTracks),
    sourceTracks,
    loading,
    error,
    validationErrors,
    hiddenCount,
    unavailableCount,
    refresh,
  };
}
