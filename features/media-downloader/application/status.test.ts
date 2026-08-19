import { describe, expect, it } from "vitest";
import {
  canTransitionDownloadStatus,
  transitionDownloadStatus,
} from "./status";

describe("download status transitions", () => {
  it("allows the MVP happy path", () => {
    expect(canTransitionDownloadStatus("idle", "analyzing")).toBe(true);
    expect(canTransitionDownloadStatus("analyzing", "ready")).toBe(true);
    expect(canTransitionDownloadStatus("ready", "downloading")).toBe(true);
    expect(canTransitionDownloadStatus("downloading", "processing")).toBe(true);
    expect(canTransitionDownloadStatus("processing", "completed")).toBe(true);
  });

  it("blocks incoherent transitions", () => {
    expect(canTransitionDownloadStatus("idle", "completed")).toBe(false);
    expect(canTransitionDownloadStatus("idle", "downloading")).toBe(false);
    expect(transitionDownloadStatus("idle", "completed")).toBe("idle");
  });

  it("allows retrying after failures when media information is still present", () => {
    expect(canTransitionDownloadStatus("failed", "analyzing")).toBe(true);
    expect(canTransitionDownloadStatus("failed", "downloading")).toBe(true);
  });
});
