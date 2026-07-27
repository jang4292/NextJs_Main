"use client";

import { useEffect, useRef, useState } from "react";
import {
  PLAYLISTS,
  resolveSelectedPlaylist,
  type Track,
} from "../../application/use-cases/playlists";
import { formatAudioTime } from "@/features/music/application/use-cases/audioFormatting";

export function useMusicListViewModel() {
  const [selectedDate, setSelectedDate] = useState<string>(PLAYLISTS[0].date);
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlist = resolveSelectedPlaylist(PLAYLISTS, selectedDate);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (current) {
      audio.src = current.src;
      audio.load();
      if (playing) audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [current, playing]);

  function play(track: Track) {
    if (current?.id !== track.id) {
      setCurrent(track);
    }
    setPlaying(true);
  }

  function pause() {
    setPlaying(false);
    audioRef.current?.pause();
  }

  function stop() {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  }

  function selectDate(date: string) {
    stop();
    setCurrent(null);
    setSelectedDate(date);
  }

  function seekToPercent(pct: number) {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = pct * duration;
    }
  }

  return {
    playlists: PLAYLISTS,
    playlist,
    selectedDate,
    current,
    playing,
    currentTime,
    duration,
    audioRef,
    play,
    pause,
    stop,
    selectDate,
    seekToPercent,
    formatTime: formatAudioTime,
  };
}
