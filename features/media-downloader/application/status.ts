import type { DownloadStatus } from "../domain/mediaTypes";

const allowedTransitions: Record<DownloadStatus, DownloadStatus[]> = {
  idle: ["analyzing", "failed"],
  analyzing: ["idle", "ready", "failed"],
  ready: ["analyzing", "downloading", "failed"],
  downloading: ["processing", "completed", "failed"],
  processing: ["completed", "failed"],
  completed: ["idle", "ready", "analyzing", "downloading"],
  failed: ["idle", "ready", "analyzing", "downloading"],
};

export function canTransitionDownloadStatus(
  from: DownloadStatus,
  to: DownloadStatus,
): boolean {
  return from === to || allowedTransitions[from].includes(to);
}

export function transitionDownloadStatus(
  from: DownloadStatus,
  to: DownloadStatus,
): DownloadStatus {
  return canTransitionDownloadStatus(from, to) ? to : from;
}
