export type MediaPlatform =
  "youtube" | "instagram" | "facebook" | "naver" | "unknown";

export type DownloadType = "video" | "audio";

export type DownloadStatus =
  | "idle"
  | "analyzing"
  | "ready"
  | "downloading"
  | "processing"
  | "completed"
  | "failed";

export type MediaErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_PLATFORM"
  | "MEDIA_NOT_FOUND"
  | "MEDIA_UNAVAILABLE"
  | "FORMAT_NOT_AVAILABLE"
  | "MEDIA_TOOL_UNAVAILABLE"
  | "DOWNLOAD_FAILED"
  | "FFMPEG_FAILED"
  | "TIMEOUT"
  | "UNKNOWN";

export type MediaFormat = {
  id: string;
  type: DownloadType;
  container: "mp4" | "mp3";
  label: string;
  qualityLabel: string;
  height?: number;
  bitrateKbps?: number;
  filesizeBytes?: number;
  hasAudio: boolean;
  hasVideo: boolean;
  requiresFfmpeg: boolean;
};

export type MediaInfo = {
  platform: MediaPlatform;
  originalUrl: string;
  title: string;
  thumbnail?: string;
  durationSeconds?: number;
  formats: MediaFormat[];
};

export type DownloadRequest = {
  url: string;
  type: DownloadType;
  formatId: string;
  quality?: string;
};

export type MediaErrorResponse = {
  code: MediaErrorCode;
  message: string;
};

export type AnalyzeMediaResponse = MediaInfo | MediaErrorResponse;

export type DownloadSelection =
  | {
      type: "video";
      formatId: string;
      maxHeight: 360 | 720 | 1080;
      container: "mp4";
    }
  | {
      type: "audio";
      formatId: string;
      bitrateKbps: 128 | 192;
      container: "mp3";
    };
