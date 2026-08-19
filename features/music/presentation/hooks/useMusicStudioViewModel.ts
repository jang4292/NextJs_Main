"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/types/track";
import {
  createCustomQueueFromHistory,
  createCustomQueueTrackFromHistory,
  createEmptyCustomQueue,
  createTrackId,
  createUrlTrack,
  findCustomQueueDuplicates,
  formatAudioTime,
  formatCustomQueueDuplicateMessage,
  formatTrackPlaybackUnavailableMessage,
  getTrackPlaybackUnavailableReason,
  hasCustomQueueDuplicates,
  isPlayableTrack,
  PLAYLISTS,
  resolveSelectedPlaylist,
  validateHttpsAudioUrl,
} from "@/features/music";
import type { MusicStudioMode } from "@/features/music/application/use-cases/musicStudioMode";

export type { MusicStudioMode };

const EMPTY_TRACKS: Track[] = [];

export function useMusicStudioViewModel(
  initialMode: MusicStudioMode = "history",
) {
  const [mode, setModeState] = useState<MusicStudioMode>(initialMode);
  const [selectedDate, setSelectedDate] = useState<string>(PLAYLISTS[0].date);
  const [queueTracks, setQueueTracks] = useState<Track[]>(() =>
    createEmptyCustomQueue(),
  );
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlArtist, setUrlArtist] = useState("");
  const [urlError, setUrlError] = useState("");
  const [queueNotice, setQueueNotice] = useState("");
  const [playbackError, setPlaybackError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef(queueTracks);
  const playlist = resolveSelectedPlaylist(PLAYLISTS, selectedDate);
  const activeTracks =
    mode === "history"
      ? playlist.tracks
      : mode === "custom"
        ? queueTracks
        : EMPTY_TRACKS;
  const playableTracks = activeTracks.filter((track) => isPlayableTrack(track));
  const current = activeTracks.find((track) => track.id === currentId) ?? null;
  const currentIndex = playableTracks.findIndex(
    (track) => track.id === currentId,
  );

  useEffect(() => {
    queueRef.current = queueTracks;
  }, [queueTracks]);

  useEffect(() => {
    return () => {
      queueRef.current.forEach((track) => {
        if (track.isObjectUrl) {
          URL.revokeObjectURL(track.src);
        }
      });
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onError = () => {
      setPlaying(false);
      setPlaybackError(
        "음원을 재생할 수 없습니다. S3/CDN URL, Content-Type, 네트워크 상태를 확인해 주세요.",
      );
    };

    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          setPlaying(false);
          setPlaybackError(
            "브라우저가 재생을 차단했거나 음원을 불러올 수 없습니다.",
          );
        });
        return;
      }

      nextTrack(true);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTracks, repeat, shuffle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (current) {
      audio.src = current.src;
      audio.load();
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) {
      return;
    }

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
        setPlaybackError(
          "브라우저가 재생을 차단했거나 음원을 불러올 수 없습니다.",
        );
      });
    } else {
      audio.pause();
    }
  }, [playing, current]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  function resetProgress() {
    setCurrentTime(0);
    setDuration(0);
  }

  function stop() {
    setPlaying(false);
    setPlaybackError("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    resetProgress();
  }

  function setMode(nextMode: MusicStudioMode) {
    stop();
    setQueueNotice("");
    setPlaybackError("");
    setCurrentId(null);
    setModeState(nextMode);
  }

  function selectDate(date: string) {
    stop();
    setQueueNotice("");
    setPlaybackError("");
    setCurrentId(null);
    setSelectedDate(date);
  }

  function selectTrack(track: Track) {
    setPlaybackError("");

    const unavailableReason = getTrackPlaybackUnavailableReason(track);

    if (unavailableReason) {
      stop();
      setPlaybackError(
        formatTrackPlaybackUnavailableMessage(unavailableReason),
      );
      setCurrentId(null);
      return;
    }

    if (currentId === track.id) {
      setPlaying((value) => !value);
      return;
    }

    resetProgress();
    setCurrentId(track.id);
    setPlaying(true);
  }

  function togglePlayFromCurrentOrFirst() {
    setPlaybackError("");

    if (!current && playableTracks.length > 0) {
      resetProgress();
      setCurrentId(playableTracks[0].id);
      setPlaying(true);
      return;
    }

    if (!current && activeTracks.length > 0) {
      setPlaybackError(
        "현재 브라우저에서 재생할 수 있는 곡이 없습니다. MP3 등 지원되는 음원을 사용해 주세요.",
      );
      return;
    }

    if (current) {
      setPlaying((value) => !value);
    }
  }

  function nextTrack(auto = false) {
    if (playableTracks.length === 0) {
      return;
    }

    setPlaybackError("");

    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playableTracks.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= playableTracks.length) {
        if (auto && !repeat) {
          setPlaying(false);
          return;
        }
        nextIndex = 0;
      }
    }

    resetProgress();
    setCurrentId(playableTracks[nextIndex].id);
    setPlaying(true);
  }

  function previousTrack() {
    if (playableTracks.length === 0) {
      return;
    }

    setPlaybackError("");

    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = playableTracks.length - 1;
    }

    resetProgress();
    setCurrentId(playableTracks[previousIndex].id);
    setPlaying(true);
  }

  function seek(value: number) {
    setCurrentTime(value);
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = value;
    }
  }

  function seekToPercent(percent: number) {
    if (duration > 0) {
      seek(percent * duration);
    }
  }

  function loadHistoryIntoCustomQueue() {
    stop();
    setQueueNotice(
      `${playlist.label} 전체 ${playlist.tracks.length}곡을 Custom Queue로 보냈습니다.`,
    );
    setPlaybackError("");
    setCurrentId(null);
    setQueueTracks(createCustomQueueFromHistory(playlist));
    setModeState("custom");
  }

  function addHistoryTrackToCustomQueue(track: Track) {
    setPlaybackError("");
    setQueueNotice("");

    const duplicateSummary = findCustomQueueDuplicates(queueRef.current, track);

    if (hasCustomQueueDuplicates(duplicateSummary)) {
      const shouldAdd =
        typeof window === "undefined" ||
        window.confirm(
          formatCustomQueueDuplicateMessage(track, duplicateSummary),
        );

      if (!shouldAdd) {
        return;
      }
    }

    setQueueTracks((previousTracks) => {
      const nextTracks = [
        ...previousTracks,
        createCustomQueueTrackFromHistory(track),
      ];
      queueRef.current = nextTracks;
      return nextTracks;
    });
    setQueueNotice(`"${track.title}"을(를) Custom Queue에 추가했습니다.`);
  }

  function removeTrack(id: string) {
    setQueueTracks((previousTracks) => {
      const track = previousTracks.find((item) => item.id === id);
      if (track?.isObjectUrl) {
        URL.revokeObjectURL(track.src);
      }
      return previousTracks.filter((item) => item.id !== id);
    });

    if (currentId === id) {
      stop();
      setPlaybackError("");
      setCurrentId(null);
    }
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const newTracks: Track[] = files.map((file) => ({
      id: createTrackId(),
      bpm: 0,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      genre: "Local",
      src: URL.createObjectURL(file),
      isObjectUrl: true,
    }));

    setQueueTracks((previousTracks) => [...previousTracks, ...newTracks]);
    setQueueNotice(
      `${newTracks.length}개 로컬 파일을 Custom Queue에 추가했습니다.`,
    );
    event.target.value = "";
  }

  function handleAddUrl(event: FormEvent) {
    event.preventDefault();
    setUrlError("");

    try {
      const normalizedUrl = validateHttpsAudioUrl(urlInput);
      setQueueTracks((previousTracks) => [
        ...previousTracks,
        createUrlTrack({
          id: createTrackId(),
          url: normalizedUrl,
          title: urlTitle,
          artist: urlArtist,
        }),
      ]);
      setQueueNotice("URL 트랙을 Custom Queue에 추가했습니다.");
    } catch (error) {
      setUrlError(
        error instanceof Error
          ? error.message
          : "올바른 URL 형식이 아닙니다. / Invalid URL format.",
      );
      return;
    }

    setUrlInput("");
    setUrlTitle("");
    setUrlArtist("");
  }

  return {
    addHistoryTrackToCustomQueue,
    activeTracks,
    audioRef,
    current,
    currentId,
    currentTime,
    duration,
    formatTime: formatAudioTime,
    handleAddUrl,
    handleFileUpload,
    loadHistoryIntoCustomQueue,
    mode,
    nextTrack,
    pause: () => setPlaying(false),
    playbackError,
    playableTracks,
    playlist,
    playing,
    playlists: PLAYLISTS,
    previousTrack,
    queueNotice,
    queueTracks,
    removeTrack,
    repeat,
    seek,
    seekToPercent,
    selectDate,
    selectedDate,
    selectTrack,
    setMode,
    setRepeat,
    setShuffle,
    setUrlArtist,
    setUrlInput,
    setUrlTitle,
    setVolume,
    shuffle,
    stop,
    togglePlayFromCurrentOrFirst,
    urlArtist,
    urlError,
    urlInput,
    urlTitle,
    volume,
  };
}
