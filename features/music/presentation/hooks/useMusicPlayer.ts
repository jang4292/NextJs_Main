"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  MusicTrack,
  RepeatMode,
} from "@/features/music/domain/entities/MusicTrack";
import { formatAudioTime } from "@/features/music/application/use-cases/audioFormatting";
import {
  getNextTrackId,
  getPlayableTracks,
  getPreviousTrackId,
  resolvePlaybackTracks,
  shuffleMusicTracks,
  type PlaybackStepReason,
} from "@/features/music/application/use-cases/playerQueue";
import {
  formatMusicTrackPlaybackUnavailableMessage,
  getMusicTrackPlaybackUnavailableReason,
  isPlayableMusicTrack,
} from "@/features/music/application/use-cases/musicValidation";

type PersistedPlayerPreferences = {
  selectedTrackIds: string[];
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
};

const STORAGE_KEY = "music-json-player:v1";
const DEFAULT_VOLUME = 1;

export function useMusicPlayer(tracks: MusicTrack[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [customOrderIds, setCustomOrderIds] = useState<string[] | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [shuffle, setShuffle] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [preferencesReady, setPreferencesReady] = useState(false);

  const trackMap = useMemo(
    () => new Map(tracks.map((track) => [track.id, track])),
    [tracks],
  );

  const orderedTracks = useMemo(() => {
    if (!customOrderIds) {
      return tracks;
    }

    const customTracks = customOrderIds
      .map((id) => trackMap.get(id))
      .filter((track): track is MusicTrack => Boolean(track));
    const customIdSet = new Set(customTracks.map((track) => track.id));
    const addedTracks = tracks.filter((track) => !customIdSet.has(track.id));

    return [...customTracks, ...addedTracks];
  }, [customOrderIds, trackMap, tracks]);

  const playableTracks = useMemo(
    () => getPlayableTracks(orderedTracks),
    [orderedTracks],
  );

  const selectableIds = useMemo(
    () => new Set(playableTracks.map((track) => track.id)),
    [playableTracks],
  );

  const validSelectedTrackIds = useMemo(
    () => selectedTrackIds.filter((id) => selectableIds.has(id)),
    [selectableIds, selectedTrackIds],
  );

  const playbackTracks = useMemo(
    () => resolvePlaybackTracks(orderedTracks, validSelectedTrackIds),
    [orderedTracks, validSelectedTrackIds],
  );

  const currentTrack =
    orderedTracks.find((track) => track.id === currentTrackId) ?? null;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const preferences = readPersistedPreferences();

    if (preferences) {
      setSelectedTrackIds(preferences.selectedTrackIds);
      setVolume(preferences.volume);
      setIsMuted(preferences.isMuted);
      setRepeatMode(preferences.repeatMode);
      setShuffle(preferences.shuffle);
    }

    setPreferencesReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!preferencesReady) {
      return;
    }

    writePersistedPreferences({
      selectedTrackIds: validSelectedTrackIds,
      volume,
      isMuted,
      repeatMode,
      shuffle,
    });
  }, [
    isMuted,
    preferencesReady,
    repeatMode,
    validSelectedTrackIds,
    shuffle,
    volume,
  ]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }

    if (audio.getAttribute("src") !== currentTrack.audioUrl) {
      audio.setAttribute("src", currentTrack.audioUrl);
      audio.load();
      setCurrentTime(0);
      setDuration(currentTrack.duration ?? 0);
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = isMuted;
  }, [isMuted, volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setPlaybackError(
          "브라우저가 재생을 차단했거나 음원을 불러올 수 없습니다.",
        );
      });
      return;
    }

    audio.pause();
  }, [currentTrack, isPlaying]);

  const advanceTrack = useCallback(
    (reason: PlaybackStepReason = "manual") => {
      if (playbackTracks.length === 0) {
        setIsPlaying(false);
        return;
      }

      const nextTrackId = getNextTrackId({
        tracks: playbackTracks,
        currentTrackId,
        repeatMode,
        shuffle,
        reason,
      });

      if (!nextTrackId) {
        setIsPlaying(false);
        return;
      }

      if (
        reason === "ended" &&
        repeatMode === "one" &&
        nextTrackId === currentTrackId
      ) {
        const audio = audioRef.current;
        setCurrentTime(0);

        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {
            setIsPlaying(false);
            setPlaybackError(
              "브라우저가 재생을 차단했거나 음원을 불러올 수 없습니다.",
            );
          });
        }

        return;
      }

      setPlaybackError("");
      setCurrentTime(0);
      setDuration(0);
      setCurrentTrackId(nextTrackId);
      setIsPlaying(true);
    },
    [currentTrackId, playbackTracks, repeatMode, shuffle],
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const updateCurrentTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const updateDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handleError = () => {
      setIsPlaying(false);
      setPlaybackError(
        "음원을 재생할 수 없습니다. S3/CDN의 CORS와 Content-Type 설정을 확인해 주세요.",
      );
    };
    const handleEnded = () => advanceTrack("ended");

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [advanceTrack]);

  const seek = useCallback(
    (value: number) => {
      const nextTime = clamp(value, 0, duration > 0 ? duration : value);
      const audio = audioRef.current;

      if (audio) {
        audio.currentTime = nextTime;
      }

      setCurrentTime(nextTime);
    },
    [duration],
  );

  const jumpBy = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      const sourceTime = audio?.currentTime ?? currentTime;
      const knownDuration = Number.isFinite(audio?.duration)
        ? (audio?.duration ?? 0)
        : duration;
      const nextTime =
        knownDuration > 0
          ? clamp(sourceTime + seconds, 0, knownDuration)
          : Math.max(0, sourceTime + seconds);

      if (audio) {
        audio.currentTime = nextTime;
      }

      setCurrentTime(nextTime);
    },
    [currentTime, duration],
  );

  const playTrack = useCallback(
    (track: MusicTrack) => {
      const unavailableReason = getMusicTrackPlaybackUnavailableReason(track);

      if (unavailableReason) {
        setPlaybackError(
          formatMusicTrackPlaybackUnavailableMessage(unavailableReason),
        );
        return;
      }

      setPlaybackError("");

      if (currentTrackId === track.id) {
        setIsPlaying((value) => !value);
        return;
      }

      setCurrentTime(0);
      setDuration(track.duration ?? 0);
      setCurrentTrackId(track.id);
      setIsPlaying(true);
    },
    [currentTrackId],
  );

  const togglePlayFromCurrentOrFirst = useCallback(() => {
    if (currentTrack) {
      setIsPlaying((value) => !value);
      return;
    }

    const firstTrack = playbackTracks[0];

    if (!firstTrack) {
      setPlaybackError(
        "현재 브라우저에서 재생할 수 있는 곡이 없습니다. MP3 등 지원되는 음원을 사용해 주세요.",
      );
      return;
    }

    setPlaybackError("");
    setCurrentTime(0);
    setDuration(firstTrack.duration ?? 0);
    setCurrentTrackId(firstTrack.id);
    setIsPlaying(true);
  }, [currentTrack, playbackTracks]);

  const previousTrack = useCallback(() => {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      seek(0);
      return;
    }

    const previousTrackId = getPreviousTrackId(playbackTracks, currentTrackId);

    if (!previousTrackId) {
      setIsPlaying(false);
      return;
    }

    setPlaybackError("");
    setCurrentTime(0);
    setDuration(0);
    setCurrentTrackId(previousTrackId);
    setIsPlaying(true);
  }, [currentTrackId, playbackTracks, seek]);

  const nextTrack = useCallback(() => {
    advanceTrack("manual");
  }, [advanceTrack]);

  const stop = useCallback(() => {
    const audio = audioRef.current;

    setIsPlaying(false);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setCurrentTime(0);
  }, []);

  const setPlayerVolume = useCallback((value: number) => {
    const nextVolume = clamp(value, 0, 1);
    setVolume(nextVolume);

    if (nextVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((value) => !value);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((value) => {
      if (value === "none") return "all";
      if (value === "all") return "one";
      return "none";
    });
  }, []);

  const toggleTrackSelection = useCallback(
    (trackId: string) => {
      const track = trackMap.get(trackId);

      if (!track || !isPlayableMusicTrack(track)) {
        return;
      }

      setSelectedTrackIds((previousIds) =>
        previousIds.includes(trackId)
          ? previousIds.filter((id) => id !== trackId)
          : [...previousIds, trackId],
      );
    },
    [trackMap],
  );

  const selectAllTracks = useCallback(() => {
    setSelectedTrackIds(playableTracks.map((track) => track.id));
  }, [playableTracks]);

  const clearSelectedTracks = useCallback(() => {
    setSelectedTrackIds([]);
  }, []);

  const shuffleTrackList = useCallback(() => {
    const shuffledTrackIds = shuffleMusicTracks(orderedTracks).map(
      (track) => track.id,
    );
    setCustomOrderIds(shuffledTrackIds);
  }, [orderedTracks]);

  return {
    activeTrackCount: playbackTracks.length,
    audioRef,
    clearSelectedTracks,
    currentTime,
    currentTrack,
    currentTrackId,
    cycleRepeatMode,
    duration,
    formatTime: formatAudioTime,
    isMuted,
    isPlaying: isPlaying && Boolean(currentTrack),
    jumpBy,
    nextTrack,
    orderedTracks,
    playTrack,
    playableTracks,
    playbackError,
    playbackTracks,
    previousTrack,
    repeatMode,
    seek,
    selectedTrackIds: validSelectedTrackIds,
    selectedTrackCount: validSelectedTrackIds.length,
    selectAllTracks,
    setPlayerVolume,
    setShuffle,
    shuffle,
    shuffleTrackList,
    stop,
    toggleMute,
    togglePlayFromCurrentOrFirst,
    toggleTrackSelection,
    volume,
  };
}

function readPersistedPreferences(): PersistedPlayerPreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<PersistedPlayerPreferences>;

    return {
      selectedTrackIds: Array.isArray(parsed.selectedTrackIds)
        ? parsed.selectedTrackIds.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
      volume:
        typeof parsed.volume === "number" && Number.isFinite(parsed.volume)
          ? clamp(parsed.volume, 0, 1)
          : DEFAULT_VOLUME,
      isMuted: parsed.isMuted === true,
      repeatMode: isRepeatMode(parsed.repeatMode) ? parsed.repeatMode : "none",
      shuffle: parsed.shuffle === true,
    };
  } catch {
    return null;
  }
}

function writePersistedPreferences(
  preferences: PersistedPlayerPreferences,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

function isRepeatMode(value: unknown): value is RepeatMode {
  return value === "none" || value === "one" || value === "all";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
