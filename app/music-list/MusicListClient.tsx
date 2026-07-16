"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PLAYLISTS, type Track } from "@/data/musicData";

function formatTime(sec: number) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function MusicListClient() {
  const [selectedDate, setSelectedDate] = useState<string>(PLAYLISTS[0].date);
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlist =
    PLAYLISTS.find((p) => p.date === selectedDate) ?? PLAYLISTS[0];

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">음원 리스트</h1>
      <p className="mb-6 text-sm text-gray-500">
        날짜별 스윙 재즈 플레이리스트
      </p>

      {/* 날짜 선택 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PLAYLISTS.map((p) => (
          <button
            key={p.date}
            onClick={() => handleDateChange(p.date)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedDate === p.date
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 현재 선택된 날짜 정보 */}
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="text-lg font-semibold text-blue-900">
          {playlist.label}
        </div>
        <div className="mt-0.5 text-sm text-blue-700">
          {playlist.description}
        </div>
      </div>

      {/* 오디오 플레이어 */}
      <div className="sticky top-16 z-10 mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="truncate pr-4 text-sm font-medium">
            {current
              ? `${current.title} — ${current.artist}`
              : "트랙을 선택해 주세요"}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => current && handlePlay(current)}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
            >
              재생
            </button>
            <button
              onClick={handlePause}
              className="rounded bg-yellow-400 px-3 py-1 text-sm transition-colors hover:bg-yellow-500"
            >
              일시정지
            </button>
            <button
              onClick={handleStop}
              className="rounded bg-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-300"
            >
              정지
            </button>
          </div>
        </div>
        <div className="mb-2 text-xs text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div
          className="h-2 w-full cursor-pointer rounded bg-gray-200"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(
              0,
              Math.min(1, (e.clientX - rect.left) / rect.width),
            );
            if (audioRef.current && duration > 0) {
              audioRef.current.currentTime = pct * duration;
            }
          }}
        >
          <div
            className="h-2 rounded bg-blue-600 transition-all"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* 트랙 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-12 px-4 py-3 text-left font-semibold text-gray-600">
                #
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                제목
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                아티스트
              </th>
              <th className="w-20 px-4 py-3 text-right font-semibold text-gray-600">
                BPM
              </th>
              <th className="w-24 px-4 py-3 text-center font-semibold text-gray-600">
                재생
              </th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.map((track) => (
              <tr
                key={track.id}
                className={`cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50 ${
                  current?.id === track.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handlePlay(track)}
              >
                <td className="px-4 py-3 text-gray-400">{track.number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{track.title}</div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {track.genre}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{track.artist}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">
                  {track.bpm}
                </td>
                <td className="px-4 py-3 text-center">
                  {current?.id === track.id && playing ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
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
