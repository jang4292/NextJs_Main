"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PLAYLISTS, type Track } from "@/data/musicData";

function formatTime(sec: number) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MusicListPage() {
  const [selectedDate, setSelectedDate] = useState<string>(PLAYLISTS[0].date);
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlist = PLAYLISTS.find((p) => p.date === selectedDate) ?? PLAYLISTS[0];

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

  function handlePlay(track: Track) {
    if (current?.id !== track.id) {
      setCurrent(track);
    }
    setPlaying(true);
  }

  function handlePause() {
    setPlaying(false);
    audioRef.current?.pause();
  }

  function handleStop() {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  }

  function handleDateChange(date: string) {
    handleStop();
    setCurrent(null);
    setSelectedDate(date);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">음원 리스트</h1>
      <p className="text-gray-500 mb-6 text-sm">날짜별 스윙 재즈 플레이리스트</p>

      {/* 날짜 선택 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PLAYLISTS.map((p) => (
          <button
            key={p.date}
            onClick={() => handleDateChange(p.date)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedDate === p.date
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 현재 선택된 날짜 정보 */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6">
        <div className="text-lg font-semibold text-blue-900">{playlist.label}</div>
        <div className="text-sm text-blue-700 mt-0.5">{playlist.description}</div>
      </div>

      {/* 오디오 플레이어 */}
      <div className="sticky top-16 bg-white border rounded-lg shadow-sm p-4 mb-6 z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium truncate pr-4">
            {current ? `${current.title} — ${current.artist}` : "트랙을 선택해 주세요"}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => current && handlePlay(current)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              재생
            </button>
            <button
              onClick={handlePause}
              className="px-3 py-1 text-sm bg-yellow-400 rounded hover:bg-yellow-500 transition-colors"
            >
              일시정지
            </button>
            <button
              onClick={handleStop}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              정지
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div
          className="w-full h-2 bg-gray-200 rounded cursor-pointer"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (audioRef.current && duration > 0) {
              audioRef.current.currentTime = pct * duration;
            }
          }}
        >
          <div
            className="h-2 bg-blue-600 rounded transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 트랙 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">제목</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">아티스트</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 w-20">BPM</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 w-24">재생</th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.map((track) => (
              <tr
                key={track.id}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer ${
                  current?.id === track.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handlePlay(track)}
              >
                <td className="px-4 py-3 text-gray-400">{track.number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{track.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{track.genre}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{track.artist}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">{track.bpm}</td>
                <td className="px-4 py-3 text-center">
                  {current?.id === track.id && playing ? (
                    <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                      재생중
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(track);
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      ▶ 재생
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
