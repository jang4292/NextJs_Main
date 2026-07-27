"use client";

import type { MouseEvent } from "react";
import type { Track } from "@/types/track";
import {
  ListMusic,
  Link as LinkIcon,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Square,
  Upload,
  Volume2,
} from "lucide-react";
import {
  useMusicStudioViewModel,
  type MusicStudioMode,
} from "./hooks/useMusicStudioViewModel";

const modeLabels: Record<MusicStudioMode, string> = {
  playlist: "Playlists",
  dj: "DJ Queue",
};

type MusicStudioViewModel = Omit<
  ReturnType<typeof useMusicStudioViewModel>,
  "audioRef"
>;

export function MusicStudio({
  initialMode = "playlist",
}: {
  initialMode?: MusicStudioMode;
}) {
  const { audioRef, ...vm } = useMusicStudioViewModel(initialMode);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-md border bg-white p-1">
        {(["playlist", "dj"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => vm.setMode(mode)}
            className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
              vm.mode === mode
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
            }`}
          >
            <ListMusic className="h-4 w-4" aria-hidden="true" />
            {modeLabels[mode]}
          </button>
        ))}
      </div>

      <PlayerPanel vm={vm} />

      {vm.mode === "playlist" ? (
        <PlaylistPanel vm={vm} />
      ) : (
        <DjQueuePanel vm={vm} />
      )}

      <audio ref={audioRef} />
    </div>
  );
}

function PlayerPanel({ vm }: { vm: MusicStudioViewModel }) {
  return (
    <section className="sticky top-16 z-20 rounded-md border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-500">
            {vm.mode === "playlist" ? vm.playlist.label : "DJ Queue"}
          </p>
          <h2 className="truncate text-lg font-semibold text-neutral-950">
            {vm.current ? vm.current.title : "트랙을 선택해 주세요"}
          </h2>
          <p className="truncate text-sm text-neutral-500">
            {vm.current
              ? `${vm.current.artist}${vm.current.bpm ? ` · BPM ${vm.current.bpm}` : ""} · ${vm.current.genre}`
              : "No track selected"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            label="Previous"
            disabled={!vm.current}
            onClick={vm.previousTrack}
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            label={vm.playing ? "Pause" : "Play"}
            disabled={vm.activeTracks.length === 0}
            primary
            onClick={vm.togglePlayFromCurrentOrFirst}
          >
            {vm.playing ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>
          <IconButton label="Stop" disabled={!vm.current} onClick={vm.stop}>
            <Square className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Next"
            disabled={!vm.current}
            onClick={() => vm.nextTrack(false)}
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <input
          type="range"
          min={0}
          max={vm.duration || 0}
          step={0.1}
          value={vm.currentTime}
          onChange={(event) => vm.seek(Number(event.target.value))}
          className="w-full cursor-pointer accent-neutral-900"
          aria-label="Seek"
        />
        <div className="flex justify-between text-xs text-neutral-500">
          <span>{vm.formatTime(vm.currentTime)}</span>
          <span>{vm.formatTime(vm.duration)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={vm.volume}
            onChange={(event) => vm.setVolume(Number(event.target.value))}
            className="w-full cursor-pointer accent-neutral-900"
            aria-label="Volume"
          />
          <span className="w-10 text-right text-xs text-neutral-500">
            {Math.round(vm.volume * 100)}%
          </span>
        </div>
        <ToggleButton
          active={vm.repeat}
          onClick={() => vm.setRepeat((v) => !v)}
        >
          <Repeat className="h-4 w-4" aria-hidden="true" />
          Repeat
        </ToggleButton>
        <ToggleButton
          active={vm.shuffle}
          onClick={() => vm.setShuffle((v) => !v)}
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Shuffle
        </ToggleButton>
      </div>
    </section>
  );
}

function PlaylistPanel({ vm }: { vm: MusicStudioViewModel }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-950">
            날짜별 플레이리스트
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {vm.playlist.description}
          </p>
        </div>
        <button
          type="button"
          onClick={vm.loadPlaylistIntoQueue}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <ListMusic className="h-4 w-4" aria-hidden="true" />
          DJ 큐로 복사
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {vm.playlists.map((playlist) => (
          <button
            key={playlist.date}
            type="button"
            onClick={() => vm.selectDate(playlist.date)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              vm.selectedDate === playlist.date
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
            }`}
          >
            {playlist.label}
          </button>
        ))}
      </div>

      <TrackTable
        tracks={vm.playlist.tracks}
        currentId={vm.currentId}
        playing={vm.playing}
        onSelect={vm.selectTrack}
      />
    </section>
  );
}

function DjQueuePanel({ vm }: { vm: MusicStudioViewModel }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-md border bg-white">
        <div className="border-b bg-neutral-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-800">
            DJ Queue ({vm.queueTracks.length})
          </h2>
        </div>
        {vm.queueTracks.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-neutral-400">
            재생 목록이 비어 있습니다.
          </p>
        ) : (
          <ul className="max-h-[520px] divide-y overflow-y-auto">
            {vm.queueTracks.map((track, index) => {
              const isActive = vm.currentId === track.id;
              return (
                <li
                  key={track.id}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${
                    isActive ? "bg-emerald-50" : "hover:bg-neutral-50"
                  }`}
                  onClick={() => vm.selectTrack(track)}
                >
                  <span className="w-6 shrink-0 text-center text-xs text-neutral-400">
                    {isActive && vm.playing ? "Now" : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-950">
                      {track.title}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {track.artist}
                      {track.bpm ? ` · BPM ${track.bpm}` : ""}
                      {track.genre ? ` · ${track.genre}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      vm.removeTrack(track.id);
                    }}
                    className="rounded px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${track.title}`}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        <section className="rounded-md border bg-white p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800">
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
            URL Track
          </h2>
          <form onSubmit={vm.handleAddUrl} className="space-y-3">
            <input
              type="url"
              placeholder="Audio URL (https://...)"
              value={vm.urlInput}
              onChange={(event) => vm.setUrlInput(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Title"
              value={vm.urlTitle}
              onChange={(event) => vm.setUrlTitle(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Artist"
              value={vm.urlArtist}
              onChange={(event) => vm.setUrlArtist(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
            {vm.urlError && (
              <p className="text-xs font-medium text-red-600">{vm.urlError}</p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              Add URL
            </button>
          </form>
        </section>

        <section className="rounded-md border bg-white p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Local Files
          </h2>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Choose Audio
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={vm.handleFileUpload}
              className="sr-only"
            />
          </label>
        </section>
      </div>
    </section>
  );
}

function TrackTable({
  tracks,
  currentId,
  playing,
  onSelect,
}: {
  tracks: Track[];
  currentId: string | null;
  playing: boolean;
  onSelect: (track: Track) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-neutral-50 text-left text-neutral-600">
            <th className="w-16 px-4 py-3 font-semibold">#</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Artist</th>
            <th className="w-24 px-4 py-3 text-right font-semibold">BPM</th>
            <th className="w-24 px-4 py-3 text-center font-semibold">Play</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr
              key={track.id}
              className={`cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50 ${
                currentId === track.id ? "bg-emerald-50" : ""
              }`}
              onClick={() => onSelect(track)}
            >
              <td className="px-4 py-3 text-neutral-400">
                {track.number ?? index + 1}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-neutral-950">
                  {track.title}
                </div>
                <div className="mt-0.5 text-xs text-neutral-400">
                  {track.genre}
                </div>
              </td>
              <td className="px-4 py-3 text-neutral-600">{track.artist}</td>
              <td className="px-4 py-3 text-right font-mono text-neutral-700">
                {track.bpm}
              </td>
              <td className="px-4 py-3 text-center">
                {currentId === track.id && playing ? (
                  <span className="text-xs font-medium text-emerald-700">
                    Playing
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(event: MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      onSelect(track);
                    }}
                    className="inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">Play {track.title}</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? "bg-neutral-900 text-white hover:bg-neutral-700"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

function ToggleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}
