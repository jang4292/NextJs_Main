"use client";

import { useMemo, useState } from "react";
import { transitionDownloadStatus } from "../../application/status";
import type {
  DownloadStatus,
  DownloadType,
  MediaFormat,
  MediaInfo,
} from "../../domain/mediaTypes";
import {
  analyzeMedia,
  downloadMedia,
} from "../../infrastructure/mediaDownloaderApi";

type ViewModelError = {
  message: string;
};

function pickFirstFormatId(
  mediaInfo: MediaInfo | null,
  type: DownloadType,
): string {
  return mediaInfo?.formats.find((format) => format.type === type)?.id ?? "";
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
}

export function formatDuration(seconds: number | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return "-";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return [hours, minutes, remainingSeconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  }

  return [minutes, remainingSeconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

export function formatBytes(bytes: number | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function statusLabel(status: DownloadStatus): string {
  return {
    idle: "대기 중",
    analyzing: "분석 중",
    ready: "준비 완료",
    downloading: "다운로드 중",
    processing: "파일 처리 중",
    completed: "완료",
    failed: "실패",
  }[status];
}

export function statusDescription(status: DownloadStatus): string {
  return {
    idle: "URL을 분석하면 선택 가능한 포맷이 표시됩니다.",
    analyzing: "미디어 정보를 확인하고 있습니다.",
    ready: "포맷을 선택한 뒤 다운로드할 수 있습니다.",
    downloading: "선택한 포맷을 내려받고 있습니다.",
    processing: "브라우저 저장을 준비하고 있습니다.",
    completed: "다운로드 요청이 완료되었습니다.",
    failed: "요청이 실패했습니다. 입력값과 로컬 도구 상태를 확인해주세요.",
  }[status];
}

function errorMessageFromUnknown(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

export function useMediaDownloaderViewModel() {
  const [url, setUrl] = useState("");
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [selectedType, setSelectedType] = useState<DownloadType>("video");
  const [selectedFormatId, setSelectedFormatId] = useState("");
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [error, setError] = useState<ViewModelError | null>(null);

  const selectedFormats = useMemo(
    () =>
      mediaInfo?.formats.filter((format) => format.type === selectedType) ?? [],
    [mediaInfo, selectedType],
  );

  const selectedFormat = useMemo(
    () =>
      selectedFormats.find((format) => format.id === selectedFormatId) ??
      selectedFormats[0],
    [selectedFormatId, selectedFormats],
  );

  const isBusy =
    status === "analyzing" ||
    status === "downloading" ||
    status === "processing";

  function updateUrl(nextUrl: string) {
    setUrl(nextUrl);
    setError(null);

    if (mediaInfo) {
      setMediaInfo(null);
      setSelectedFormatId("");
      setStatus("idle");
    } else if (status === "failed") {
      setStatus("idle");
    }
  }

  function updateType(type: DownloadType) {
    setSelectedType(type);
    setSelectedFormatId(pickFirstFormatId(mediaInfo, type));
  }

  async function submitAnalyze() {
    setError(null);
    setStatus((currentStatus) =>
      transitionDownloadStatus(currentStatus, "analyzing"),
    );

    try {
      const analyzedMedia = await analyzeMedia(url);
      setMediaInfo(analyzedMedia);
      setSelectedType("video");
      setSelectedFormatId(pickFirstFormatId(analyzedMedia, "video"));
      setStatus("ready");
    } catch (analyzeError) {
      setError({
        message: errorMessageFromUnknown(
          analyzeError,
          "미디어 분석에 실패했습니다.",
        ),
      });
      setMediaInfo(null);
      setSelectedFormatId("");
      setStatus("failed");
    }
  }

  async function submitDownload() {
    if (!mediaInfo || !selectedFormat) return;

    setError(null);
    setStatus((currentStatus) =>
      transitionDownloadStatus(currentStatus, "downloading"),
    );

    try {
      const download = await downloadMedia({
        url: mediaInfo.originalUrl,
        type: selectedType,
        formatId: selectedFormat.id,
      });
      setStatus("processing");
      triggerBrowserDownload(download.blob, download.filename);
      setStatus("completed");
    } catch (downloadError) {
      setError({
        message: errorMessageFromUnknown(
          downloadError,
          "다운로드에 실패했습니다.",
        ),
      });
      setStatus("failed");
    }
  }

  return {
    url,
    updateUrl,
    mediaInfo,
    selectedType,
    updateType,
    selectedFormatId,
    setSelectedFormatId,
    selectedFormat,
    selectedFormats: selectedFormats as MediaFormat[],
    status,
    error,
    isBusy,
    isAnalyzing: status === "analyzing",
    isDownloading: status === "downloading" || status === "processing",
    canAnalyze: url.trim().length > 0 && !isBusy,
    canDownload: Boolean(mediaInfo && selectedFormat) && !isBusy,
    submitAnalyze,
    submitDownload,
  };
}
