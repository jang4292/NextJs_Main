import type {
  DownloadSelection,
  DownloadType,
  MediaFormat,
} from "../domain/mediaTypes";

export type YtDlpFormatInput = {
  format_id?: string;
  ext?: string;
  height?: number | null;
  vcodec?: string | null;
  acodec?: string | null;
  tbr?: number | null;
  abr?: number | null;
  filesize?: number | null;
  filesize_approx?: number | null;
};

const VIDEO_TARGETS = [360, 720, 1080] as const;
const AUDIO_TARGETS = [128, 192] as const;

function hasVideo(format: YtDlpFormatInput): boolean {
  return Boolean(format.vcodec && format.vcodec !== "none");
}

function hasAudio(format: YtDlpFormatInput): boolean {
  return Boolean(format.acodec && format.acodec !== "none");
}

function largestFilesizeForHeight(
  formats: YtDlpFormatInput[],
  height: number,
): number | undefined {
  const fileSizes = formats
    .filter((format) => hasVideo(format) && (format.height ?? 0) <= height)
    .map((format) => format.filesize ?? format.filesize_approx)
    .filter((size): size is number => typeof size === "number" && size > 0);

  return fileSizes.length > 0 ? Math.max(...fileSizes) : undefined;
}

export function mapYtDlpFormats(formats: YtDlpFormatInput[]): MediaFormat[] {
  const maxVideoHeight = Math.max(
    0,
    ...formats
      .filter(hasVideo)
      .map((format) => format.height ?? 0)
      .filter((height) => height > 0),
  );
  const hasAnyAudio = formats.some(hasAudio);
  const mapped: MediaFormat[] = [];

  for (const height of VIDEO_TARGETS) {
    if (maxVideoHeight >= height) {
      mapped.push({
        id: `video-mp4-${height}`,
        type: "video",
        container: "mp4",
        label: `MP4 ${height}p`,
        qualityLabel: `${height}p`,
        height,
        filesizeBytes: largestFilesizeForHeight(formats, height),
        hasAudio: true,
        hasVideo: true,
        requiresFfmpeg: true,
      });
    }
  }

  if (hasAnyAudio) {
    for (const bitrateKbps of AUDIO_TARGETS) {
      mapped.push({
        id: `audio-mp3-${bitrateKbps}`,
        type: "audio",
        container: "mp3",
        label: `MP3 ${bitrateKbps}kbps`,
        qualityLabel: `${bitrateKbps}kbps`,
        bitrateKbps,
        hasAudio: true,
        hasVideo: false,
        requiresFfmpeg: true,
      });
    }
  }

  return mapped;
}

export function parseMediaFormatId(formatId: string): DownloadSelection | null {
  const videoMatch = /^video-mp4-(360|720|1080)$/.exec(formatId);
  if (videoMatch) {
    return {
      type: "video",
      formatId,
      maxHeight: Number(videoMatch[1]) as 360 | 720 | 1080,
      container: "mp4",
    };
  }

  const audioMatch = /^audio-mp3-(128|192)$/.exec(formatId);
  if (audioMatch) {
    return {
      type: "audio",
      formatId,
      bitrateKbps: Number(audioMatch[1]) as 128 | 192,
      container: "mp3",
    };
  }

  return null;
}

export function formatMatchesDownloadType(
  formatId: string,
  type: DownloadType,
): boolean {
  return parseMediaFormatId(formatId)?.type === type;
}
