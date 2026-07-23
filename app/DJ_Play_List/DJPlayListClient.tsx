"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/types/track";
import { audioUrl } from "@/lib/audio";

// ---------------------------------------------------------------------------
// Default playlist
// ---------------------------------------------------------------------------

const SAMPLE_TRACKS: Track[] = [
  {
    id: "1",
    bpm: 200,
    title: "Non Stop Flight",
    artist: "Artie Shaw",
    genre: "Swing Jazz - Balboa",
    src: audioUrl("SwingJazz/%5B200%5D+Artie+Shaw+-+Non+Stop+Flight.flac"),
  },
  {
    id: "2",
    bpm: 195,
    title: "Little Brown Jug",
    artist: "Hot Sugar Band",
    genre: "Swing Jazz - Balboa",
    src: audioUrl("SwingJazz/%5B195%5D+Hot+Sugar+Band+-+Little+Brown+Jug.mp3"),
  },
  {
    id: "3",
    bpm: 198,
    title: "Georgianna",
    artist: "Naomi & Her Handsome Devils",
    genre: "Swing Jazz - Balboa",
    src: audioUrl(
      "SwingJazz/%5B198%5D+Naomi+%26+Her+Handsome+Devils+-+Georgianna.mp3",
    ),
  },
  {
    id: "4",
    bpm: 195,
    title: "Sugar Foot Stomp",
    artist: "Benny Goodman",
    genre: "Swing Jazz - Balboa",
    src: audioUrl("SwingJazz/%5B195%5D+Benny+Goodman+-+Sugar+Foot+Stomp.mp3"),
  },
  {
    id: "5",
    bpm: 200,
    title: "It Don't Mean a Thing",
    artist: "Hop's Trio",
    genre: "Swing Jazz - Balboa",
    src: audioUrl("SwingJazz/%5B200%5D+Hop's+Trio+-+It+Don't+Mean+a+Thing.mp3"),
  },
  {
    id: "6",
    bpm: 240,
    title: "Jumpin at The Woodside",
    artist: "Count Basie",
    genre: "Swing Jazz - Balboa",
    src: audioUrl(
      "SwingJazz/%5B240%5D+Count+Basie+-+Jumpin+at+The+Woodside.mp3",
    ),
  },
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatTime(sec: number): string {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Use crypto.randomUUID for collision-free IDs; fall back to a simple counter on servers
// that don't expose the Web Crypto API.
function uid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DJPlayListClient() {
  const [tracks, setTracks] = useState<Track[]>(SAMPLE_TRACKS);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  // URL-add form state
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlArtist, setUrlArtist] = useState("");
  const [urlError, setUrlError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Keep a live ref to tracks so the unmount cleanup can revoke all remaining Object URLs.
  const tracksRef = useRef(tracks);
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  const current = tracks.find((t) => t.id === currentId) ?? null;
  const currentIndex = tracks.findIndex((t) => t.id === currentId);

  function resetProgress() {
    setCurrentTime(0);
    setDuration(0);
  }

  // ---- Revoke Object URLs on unmount to prevent memory leaks ----
  useEffect(() => {
    return () => {
      tracksRef.current.forEach((t) => {
        if (t.isObjectUrl) URL.revokeObjectURL(t.src);
      });
    };
  }, []);

  // ---- Audio event listeners (mount once) ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoaded = () =>
      setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
      } else {
        handleNext(true /* auto */);
      }
    };
    const onError = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat, shuffle, tracks]);

  // ---- Load track when currentId changes ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (current) {
      audio.src = current.src;
      audio.load();
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [current]);

  // ---- Play / pause based on `playing` state ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, current]);

  // ---- Sync volume ----
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ---- Navigation helpers ----
  function handleNext(auto = false) {
    if (tracks.length === 0) return;
    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= tracks.length) {
        if (auto && !repeat) {
          setPlaying(false);
          return;
        }
        nextIndex = 0;
      }
    }
    resetProgress();
    setCurrentId(tracks[nextIndex].id);
    setPlaying(true);
  }

  function handlePrev() {
    if (tracks.length === 0) return;
    const audio = audioRef.current;
    // If more than 3 s into the track, restart from beginning
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1;
    resetProgress();
    setCurrentId(tracks[prevIndex].id);
    setPlaying(true);
  }

  function handleSelectTrack(t: Track) {
    if (currentId === t.id) {
      setPlaying((p) => !p);
    } else {
      resetProgress();
      setCurrentId(t.id);
      setPlaying(true);
    }
  }

  function handleStop() {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  }

  function handleRemoveTrack(id: string) {
    setTracks((prev) => {
      const t = prev.find((x) => x.id === id);
      if (t?.isObjectUrl) URL.revokeObjectURL(t.src);
      return prev.filter((x) => x.id !== id);
    });
    if (currentId === id) {
      handleStop();
      resetProgress();
      setCurrentId(null);
    }
  }

  // ---- Local file upload ----
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newTracks: Track[] = files.map((file) => ({
      id: uid(),
      bpm: 0,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      genre: "Local",
      src: URL.createObjectURL(file),
      isObjectUrl: true,
    }));
    setTracks((prev) => [...prev, ...newTracks]);
    // Reset file input so the same file can be re-added
    e.target.value = "";
  }

  // ---- URL-based track addition ----
  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    setUrlError("");
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError("URL을 입력하세요. / Please enter a URL.");
      return;
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "https:") {
        setUrlError("https URL만 허용됩니다. / Only https URLs are allowed.");
        return;
      }
      const normalizedUrl = parsed.href;
      setTracks((prev) => [
        ...prev,
        {
          id: uid(),
          bpm: 0,
          title: urlTitle.trim() || normalizedUrl,
          artist: urlArtist.trim() || "Unknown",
          genre: "URL",
          src: normalizedUrl,
        },
      ]);
    } catch {
      setUrlError("올바른 URL 형식이 아닙니다. / Invalid URL format.");
      return;
    }
    setUrlInput("");
    setUrlTitle("");
    setUrlArtist("");
  }

  // ---- Render ----

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">🎵 DJ Play List</h1>

      {/* ── Player ── */}
      <div className="space-y-3 rounded-xl border bg-gray-50 p-4 shadow-sm">
        {/* Track info */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">
              {current ? current.title : "No track selected"}
            </p>
            <p className="truncate text-sm text-gray-500">
              {current
                ? `${current.artist}${current.bpm ? ` • BPM ${current.bpm}` : ""} • ${current.genre}`
                : "—"}
            </p>
          </div>
          {/* Repeat / Shuffle toggles */}
          <div className="mt-1 flex shrink-0 gap-1">
            <button
              onClick={() => setRepeat((r) => !r)}
              title={repeat ? "Repeat ON" : "Repeat OFF"}
              className={`rounded border px-2 py-1 text-xs ${repeat ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600"}`}
            >
              🔁
            </button>
            <button
              onClick={() => setShuffle((s) => !s)}
              title={shuffle ? "Shuffle ON" : "Shuffle OFF"}
              className={`rounded border px-2 py-1 text-xs ${shuffle ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600"}`}
            >
              🔀
            </button>
          </div>
        </div>

        {/* SeekBar */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (audioRef.current && duration > 0) {
                audioRef.current.currentTime = val;
              }
            }}
            className="w-full cursor-pointer accent-blue-600"
            aria-label="Seek"
          />
          <div className="flex justify-between text-xs text-gray-500 select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Transport controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            disabled={!current}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-40"
            title="Previous"
            aria-label="Previous track"
          >
            ⏮
          </button>
          <button
            onClick={() => {
              if (!current && tracks.length > 0) {
                resetProgress();
                setCurrentId(tracks[0].id);
                setPlaying(true);
              } else {
                setPlaying((p) => !p);
              }
            }}
            disabled={tracks.length === 0}
            className="rounded-full bg-blue-600 p-3 text-lg text-white hover:bg-blue-700 disabled:opacity-40"
            title={playing ? "Pause" : "Play"}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "⏸" : "▶️"}
          </button>
          <button
            onClick={handleStop}
            disabled={!current}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-40"
            title="Stop"
            aria-label="Stop"
          >
            ⏹
          </button>
          <button
            onClick={() => handleNext(false)}
            disabled={!current}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-40"
            title="Next"
            aria-label="Next track"
          >
            ⏭
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span className="w-6 text-center text-sm text-gray-500">
            {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 cursor-pointer accent-blue-600"
            aria-label="Volume"
          />
          <span className="w-8 text-right text-xs text-gray-500">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* ── Add via URL ── */}
      <section className="space-y-2 rounded-xl border p-4">
        <h2 className="text-sm font-semibold text-gray-700">
          🌐 URL로 트랙 추가 / Add track via URL
        </h2>
        <form onSubmit={handleAddUrl} className="space-y-2">
          <input
            type="url"
            placeholder="Audio URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Title (optional)"
              value={urlTitle}
              onChange={(e) => setUrlTitle(e.target.value)}
              className="flex-1 rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Artist (optional)"
              value={urlArtist}
              onChange={(e) => setUrlArtist(e.target.value)}
              className="flex-1 rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          {urlError && <p className="text-xs text-red-500">{urlError}</p>}
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            추가 / Add
          </button>
        </form>
      </section>

      {/* ── Add Local File ── */}
      <section className="space-y-2 rounded-xl border p-4">
        <h2 className="text-sm font-semibold text-gray-700">
          📁 로컬 파일 추가 / Add local files
        </h2>
        <label className="flex cursor-pointer items-center gap-3">
          <span className="rounded border bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">
            파일 선택 / Choose files
          </span>
          <span className="text-xs text-gray-500">
            MP3, FLAC, WAV, OGG, AAC 등 지원
          </span>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>
      </section>

      {/* ── Playlist ── */}
      <section className="overflow-hidden rounded-xl border">
        <h2 className="border-b bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
          🎶 재생 목록 / Playlist ({tracks.length})
        </h2>
        {tracks.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-400">
            재생 목록이 비어 있습니다. / Playlist is empty.
          </p>
        ) : (
          <ul className="max-h-80 divide-y overflow-y-auto">
            {tracks.map((t, idx) => {
              const isActive = t.id === currentId;
              return (
                <li
                  key={t.id}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => handleSelectTrack(t)}
                >
                  {/* Index / playing indicator */}
                  <span className="w-5 shrink-0 text-center text-xs text-gray-400">
                    {isActive && playing ? "▶" : idx + 1}
                  </span>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${isActive ? "text-blue-700" : ""}`}
                    >
                      {t.title}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {t.artist}
                      {t.bpm ? ` • BPM ${t.bpm}` : ""}
                      {t.genre ? ` • ${t.genre}` : ""}
                    </p>
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(t.id);
                    }}
                    className="px-1 text-xs text-gray-300 hover:text-red-500"
                    aria-label={`Remove ${t.title}`}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <audio ref={audioRef} />
    </div>
  );
}
