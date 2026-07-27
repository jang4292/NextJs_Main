"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { Track } from "@/types/track";
import {
  createDefaultDjTracks,
  createQueueFromPlaylist,
  createTrackId,
  createUrlTrack,
  formatAudioTime,
  PLAYLISTS,
  resolveSelectedPlaylist,
  validateHttpsAudioUrl,
} from "@/features/music";

export type MusicStudioMode = "playlist" | "dj";

export function useMusicStudioViewModel(
  initialMode: MusicStudioMode = "playlist",
) {
  const [mode, setModeState] = useState<MusicStudioMode>(initialMode);
  const [selectedDate, setSelectedDate] = useState<string>(PLAYLISTS[0].date);
  const [queueTracks, setQueueTracks] = useState<Track[]>(() =>
    createDefaultDjTracks(),
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef(queueTracks);
  const playlist = resolveSelectedPlaylist(PLAYLISTS, selectedDate);
  const activeTracks = mode === "playlist" ? playlist.tracks : queueTracks;
  const current = activeTracks.find((track) => track.id === currentId) ?? null;
  const currentIndex = activeTracks.findIndex(
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
    const onError = () => setPlaying(false);

    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
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
      audio.play().catch(() => setPlaying(false));
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    resetProgress();
  }

  function setMode(nextMode: MusicStudioMode) {
    stop();
    setCurrentId(null);
    setModeState(nextMode);
  }

  function selectDate(date: string) {
    stop();
    setCurrentId(null);
    setSelectedDate(date);
  }

  function selectTrack(track: Track) {
    if (currentId === track.id) {
      setPlaying((value) => !value);
      return;
    }

    resetProgress();
    setCurrentId(track.id);
    setPlaying(true);
  }

  function togglePlayFromCurrentOrFirst() {
    if (!current && activeTracks.length > 0) {
      resetProgress();
      setCurrentId(activeTracks[0].id);
      setPlaying(true);
      return;
    }

    setPlaying((value) => !value);
  }

  function nextTrack(auto = false) {
    if (activeTracks.length === 0) {
      return;
    }

    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * activeTracks.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= activeTracks.length) {
        if (auto && !repeat) {
          setPlaying(false);
          return;
        }
        nextIndex = 0;
      }
    }

    resetProgress();
    setCurrentId(activeTracks[nextIndex].id);
    setPlaying(true);
  }

  function previousTrack() {
    if (activeTracks.length === 0) {
      return;
    }

    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = activeTracks.length - 1;
    }

    resetProgress();
    setCurrentId(activeTracks[previousIndex].id);
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

  function loadPlaylistIntoQueue() {
    stop();
    setCurrentId(null);
    setQueueTracks(createQueueFromPlaylist(playlist));
    setModeState("dj");
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
    activeTracks,
    audioRef,
    current,
    currentId,
    currentTime,
    duration,
    formatTime: formatAudioTime,
    handleAddUrl,
    handleFileUpload,
    loadPlaylistIntoQueue,
    mode,
    nextTrack,
    pause: () => setPlaying(false),
    playlist,
    playing,
    playlists: PLAYLISTS,
    previousTrack,
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
