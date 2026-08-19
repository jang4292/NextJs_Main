"use client";

import {
  AlertCircle,
  Download,
  Loader2,
  Music2,
  Search,
  Video,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  formatBytes,
  formatDuration,
  statusDescription,
  statusLabel,
  useMediaDownloaderViewModel,
} from "./hooks/useMediaDownloaderViewModel";

export function MediaDownloader() {
  const vm = useMediaDownloaderViewModel();

  return (
    <div className="space-y-6">
      <form
        className="space-y-4 rounded-md border border-neutral-200 bg-white p-4 shadow-sm md:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          void vm.submitAnalyze();
        }}
        noValidate
      >
        <div className="space-y-2">
          <label
            htmlFor="media-url"
            className="text-sm font-semibold text-neutral-900"
          >
            Media URL
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="media-url"
              type="url"
              inputMode="url"
              value={vm.url}
              onChange={(event) => vm.updateUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="min-h-10 flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-950 transition-colors outline-none placeholder:text-neutral-400 focus:border-neutral-900"
              disabled={vm.isBusy}
              aria-describedby="media-url-policy media-downloader-error"
            />
            <Button type="submit" disabled={!vm.canAnalyze}>
              {vm.isAnalyzing ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Search aria-hidden="true" />
              )}
              Analyze
            </Button>
          </div>
          <p id="media-url-policy" className="text-xs text-neutral-500">
            권한을 보유한 공개 YouTube 단일 영상만 사용하세요.
          </p>
        </div>
      </form>

      {vm.error && (
        <div
          id="media-downloader-error"
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{vm.error.message}</span>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
          {vm.mediaInfo ? (
            <div className="space-y-4">
              {vm.mediaInfo.thumbnail && (
                <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                  <Image
                    src={vm.mediaInfo.thumbnail}
                    alt=""
                    width={1280}
                    height={720}
                    unoptimized
                    className="aspect-video w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase">
                  {vm.mediaInfo.platform}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                  {vm.mediaInfo.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Duration {formatDuration(vm.mediaInfo.durationSeconds)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
              Analyze 후 미디어 정보가 여기에 표시됩니다.
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-md border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Type</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={vm.selectedType === "video" ? "default" : "outline"}
                onClick={() => vm.updateType("video")}
                disabled={!vm.mediaInfo || vm.isBusy}
              >
                <Video aria-hidden="true" />
                Video
              </Button>
              <Button
                type="button"
                variant={vm.selectedType === "audio" ? "default" : "outline"}
                onClick={() => vm.updateType("audio")}
                disabled={!vm.mediaInfo || vm.isBusy}
              >
                <Music2 aria-hidden="true" />
                Audio
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">Format</p>
            <div className="mt-2 space-y-2">
              {vm.selectedFormats.length > 0 ? (
                vm.selectedFormats.map((format) => (
                  <label
                    key={format.id}
                    className="flex cursor-pointer items-center justify-between rounded-md border border-neutral-200 p-3 text-sm transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-950 has-[:checked]:text-white"
                  >
                    <span>
                      <span className="block font-semibold">
                        {format.label}
                      </span>
                      <span className="text-xs opacity-75">
                        {format.requiresFfmpeg ? "FFmpeg" : "Direct"}
                        {format.filesizeBytes
                          ? ` · ${formatBytes(format.filesizeBytes)}`
                          : ""}
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="media-format"
                      value={format.id}
                      checked={vm.selectedFormatId === format.id}
                      onChange={(event) =>
                        vm.setSelectedFormatId(event.target.value)
                      }
                      disabled={vm.isBusy}
                      className="h-4 w-4 accent-neutral-950"
                    />
                  </label>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
                  선택 가능한 포맷이 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-700">
            <p>
              Status:{" "}
              <span className="font-semibold text-neutral-950">
                {statusLabel(vm.status)}
              </span>
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {statusDescription(vm.status)}
            </p>
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={!vm.canDownload}
            onClick={() => void vm.submitDownload()}
          >
            {vm.isDownloading ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Download aria-hidden="true" />
            )}
            {vm.status === "failed" && vm.mediaInfo
              ? "Retry Download"
              : "Download"}
          </Button>
        </div>
      </section>
    </div>
  );
}
