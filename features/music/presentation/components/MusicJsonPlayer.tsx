"use client";

import type { MouseEvent } from "react";
import type {
  MusicTrack,
  RepeatMode,
} from "@/features/music/domain/entities/MusicTrack";
import {
  AlertCircle,
  CheckSquare,
  FastForward,
  ListMusic,
  Pause,
  Play,
  RefreshCcw,
  Repeat,
  Rewind,
  Shuffle,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { getMusicTrackPlaybackUnavailableReason } from "@/features/music/application/use-cases/musicValidation";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useTrackSource } from "../hooks/useTrackSource";

const repeatLabels: Record<RepeatMode, string> = {
  none: "No repeat",
  all: "Repeat all",
  one: "Repeat one",
};

type MusicPlayerViewModel = Omit<ReturnType<typeof useMusicPlayer>, "audioRef">;

export function MusicJsonPlayer() {
  const source = useTrackSource();
  const { audioRef, ...player } = useMusicPlayer(source.tracks);
  const hasTracks = player.orderedTracks.length > 0;

  return (
    <section className="space-y-4">
      <SourcePanel
        sourceMode={source.config.mode}
        sourceUrl={source.config.url}
        loading={source.loading}
        error={source.error}
        validationErrors={source.validationErrors}
        hiddenCount={source.hiddenCount}
        unavailableCount={source.unavailableCount}
        onRefresh={source.refresh}
      />

      {source.loading && !hasTracks ? (
        <StateMessage message="음악 목록을 불러오는 중입니다." />
      ) : source.error ? (
        <StateMessage
          tone="error"
          message="음악 목록을 불러오지 못했습니다."
          detail={source.error}
        />
      ) : !hasTracks ? (
        <StateMessage message="표시할 음악 목록이 없습니다." />
      ) : (
        <>
          <PlayerPanel player={player} />
          <SelectionPanel player={player} />
          <TrackList player={player} />
        </>
      )}

      <audio ref={audioRef} preload="metadata" />
    </section>
  );
}

function SourcePanel({
  sourceMode,
  sourceUrl,
  loading,
  error,
  validationErrors,
  hiddenCount,
  unavailableCount,
  onRefresh,
}: {
  sourceMode: string;
  sourceUrl: string;
  loading: boolean;
  error: string;
  validationErrors: string[];
  hiddenCount: number;
  unavailableCount: number;
  onRefresh: () => void;
}) {
  const hasWarnings =
    validationErrors.length > 0 || hiddenCount > 0 || unavailableCount > 0;

  return (
    <section className="rounded-md border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-500">
            Source Player · {sourceMode}
          </p>
          <h2 className="truncate text-xl font-semibold text-neutral-950">
            URL 기반 음악 목록
          </h2>
          <p className="mt-1 text-xs break-all text-neutral-500">{sourceUrl}</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-md border bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {hasWarnings && !error ? (
        <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {hiddenCount > 0 ? <p>숨김 처리된 곡: {hiddenCount}개</p> : null}
          {unavailableCount > 0 ? (
            <p>비활성 표시된 곡: {unavailableCount}개</p>
          ) : null}
          {validationErrors.slice(0, 3).map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function PlayerPanel({ player }: { player: MusicPlayerViewModel }) {
  const progressMax = player.duration || Math.max(player.currentTime, 0);
  const progressValue = Math.min(player.currentTime, progressMax);

  return (
    <section className="sticky top-16 z-20 rounded-md border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-500">
            JSON Player · {player.activeTrackCount} playable
          </p>
          <h2 className="truncate text-lg font-semibold text-neutral-950">
            {player.currentTrack?.title ?? "트랙을 선택해 주세요"}
          </h2>
          <p className="truncate text-sm text-neutral-500">
            {player.currentTrack
              ? formatTrackMeta(player.currentTrack)
              : "No track selected"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <IconButton
            label="Previous track"
            disabled={!player.currentTrack}
            onClick={player.previousTrack}
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Back 30 seconds"
            disabled={!player.currentTrack}
            onClick={() => player.jumpBy(-30)}
          >
            <Rewind className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] font-semibold">30</span>
          </IconButton>
          <IconButton
            label="Back 10 seconds"
            disabled={!player.currentTrack}
            onClick={() => player.jumpBy(-10)}
          >
            <Rewind className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] font-semibold">10</span>
          </IconButton>
          <IconButton
            label={player.isPlaying ? "Pause" : "Play"}
            disabled={!player.currentTrack && player.activeTrackCount === 0}
            primary
            onClick={player.togglePlayFromCurrentOrFirst}
          >
            {player.isPlaying ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>
          <IconButton
            label="Forward 10 seconds"
            disabled={!player.currentTrack}
            onClick={() => player.jumpBy(10)}
          >
            <FastForward className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] font-semibold">10</span>
          </IconButton>
          <IconButton
            label="Forward 30 seconds"
            disabled={!player.currentTrack}
            onClick={() => player.jumpBy(30)}
          >
            <FastForward className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] font-semibold">30</span>
          </IconButton>
          <IconButton
            label="Next track"
            disabled={player.activeTrackCount === 0}
            onClick={player.nextTrack}
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Stop"
            disabled={!player.currentTrack}
            onClick={player.stop}
          >
            <Square className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <input
          type="range"
          min={0}
          max={progressMax}
          step={0.1}
          value={progressValue}
          onChange={(event) => player.seek(Number(event.target.value))}
          className="w-full cursor-pointer accent-neutral-900"
          aria-label="Seek"
        />
        <div className="flex justify-between text-xs text-neutral-500">
          <span>{player.formatTime(player.currentTime)}</span>
          <span>{player.formatTime(player.duration)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 items-center gap-2">
          <IconButton
            label={player.isMuted ? "Unmute" : "Mute"}
            onClick={player.toggleMute}
          >
            {player.isMuted ? (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </IconButton>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={player.volume}
            onChange={(event) =>
              player.setPlayerVolume(Number(event.target.value))
            }
            className="min-w-0 flex-1 cursor-pointer accent-neutral-900"
            aria-label="Volume"
          />
          <span className="w-10 text-right text-xs text-neutral-500">
            {Math.round(player.volume * 100)}%
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ModeButton
            active={player.repeatMode !== "none"}
            label={`Repeat mode: ${repeatLabels[player.repeatMode]}`}
            onClick={player.cycleRepeatMode}
          >
            <Repeat className="h-4 w-4" aria-hidden="true" />
            {repeatLabels[player.repeatMode]}
          </ModeButton>
          <ModeButton
            active={player.shuffle}
            label="Shuffle playback"
            onClick={() => player.setShuffle((value) => !value)}
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Random
          </ModeButton>
          <ModeButton label="Shuffle list" onClick={player.shuffleTrackList}>
            <ListMusic className="h-4 w-4" aria-hidden="true" />
            Shuffle list
          </ModeButton>
        </div>
      </div>

      {player.playbackError ? (
        <p className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {player.playbackError}
        </p>
      ) : null}
    </section>
  );
}

function SelectionPanel({ player }: { player: MusicPlayerViewModel }) {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">
          선택 재생 목록
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          {player.selectedTrackCount > 0
            ? `${player.selectedTrackCount}곡만 재생합니다.`
            : "선택한 곡이 없으면 재생 가능한 전체 곡을 사용합니다."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={player.selectAllTracks}
          disabled={player.playableTracks.length === 0}
          className="inline-flex items-center gap-2 rounded-md border bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckSquare className="h-4 w-4" aria-hidden="true" />
          Select all
        </button>
        <button
          type="button"
          onClick={player.clearSelectedTracks}
          disabled={player.selectedTrackCount === 0}
          className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Square className="h-4 w-4" aria-hidden="true" />
          Clear
        </button>
      </div>
    </section>
  );
}

function TrackList({ player }: { player: MusicPlayerViewModel }) {
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-neutral-50 text-left text-neutral-600">
            <th className="w-16 px-4 py-3 font-semibold">Select</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Artist</th>
            <th className="w-24 px-4 py-3 text-right font-semibold">BPM</th>
            <th className="w-28 px-4 py-3 text-center font-semibold">Status</th>
            <th className="w-24 px-4 py-3 text-center font-semibold">Play</th>
          </tr>
        </thead>
        <tbody>
          {player.orderedTracks.map((track) => {
            const isCurrent = player.currentTrackId === track.id;
            const unavailableReason =
              getMusicTrackPlaybackUnavailableReason(track);
            const isPlayable = unavailableReason === null;
            const isSelected = player.selectedTrackIds.includes(track.id);

            return (
              <tr
                key={track.id}
                onClick={() => {
                  if (isPlayable) {
                    player.playTrack(track);
                  }
                }}
                className={`border-b border-neutral-100 transition-colors ${
                  isPlayable
                    ? "cursor-pointer hover:bg-neutral-50"
                    : "bg-neutral-50 text-neutral-400"
                } ${isCurrent ? "bg-emerald-50" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={!isPlayable}
                    onChange={() => player.toggleTrackSelection(track.id)}
                    onClick={(event: MouseEvent<HTMLInputElement>) =>
                      event.stopPropagation()
                    }
                    className="h-4 w-4 rounded border-neutral-300 accent-neutral-900 disabled:cursor-not-allowed"
                    aria-label={`Select ${track.title}`}
                  />
                </td>
                <td className="min-w-[220px] px-4 py-3">
                  <div className="font-medium text-neutral-950">
                    {track.title}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-1 text-xs text-neutral-500">
                    {track.musicType ? <span>{track.musicType}</span> : null}
                    {track.genre ? <span>{track.genre}</span> : null}
                    {track.tags?.slice(0, 3).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="min-w-[160px] px-4 py-3 text-neutral-600">
                  {track.artist}
                </td>
                <td className="px-4 py-3 text-right font-mono text-neutral-700">
                  {track.bpm ?? "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      isPlayable
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {formatPlaybackStatusLabel(unavailableReason)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    disabled={!isPlayable}
                    onClick={(event: MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      player.playTrack(track);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Play ${track.title}`}
                  >
                    {isCurrent && player.isPlaying ? (
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatPlaybackStatusLabel(
  reason: ReturnType<typeof getMusicTrackPlaybackUnavailableReason>,
): string {
  if (reason === "disabled") {
    return "Disabled";
  }

  if (reason === "unsupported-format") {
    return "Unsupported";
  }

  return "Available";
}

function StateMessage({
  message,
  detail,
  tone = "default",
}: {
  message: string;
  detail?: string;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={`rounded-md border bg-white px-4 py-8 text-center ${
        tone === "error" ? "text-red-700" : "text-neutral-500"
      }`}
    >
      <p className="text-sm font-medium">{message}</p>
      {detail ? <p className="mt-2 text-xs">{detail}</p> : null}
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
      className={`inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full px-3 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? "bg-neutral-900 text-white hover:bg-neutral-700"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

function ModeButton({
  active = false,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
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

function formatTrackMeta(track: MusicTrack): string {
  return [
    track.artist,
    track.bpm ? `BPM ${track.bpm}` : null,
    track.musicType,
    track.genre,
  ]
    .filter(Boolean)
    .join(" · ");
}
