import { spawn } from "node:child_process";

export type ProcessResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
};

export type RunProcessOptions = {
  command: string;
  args: string[];
  cwd?: string;
  timeoutMs: number;
  maxStdoutBytes?: number;
  maxStderrBytes?: number;
  env?: NodeJS.ProcessEnv;
};

export type RunProcess = (options: RunProcessOptions) => Promise<ProcessResult>;

const DEFAULT_STDOUT_LIMIT = 16 * 1024 * 1024;
const DEFAULT_STDERR_LIMIT = 128 * 1024;

function appendChunk(
  chunks: Buffer[],
  chunk: Buffer,
  currentBytes: number,
  maxBytes: number,
): { bytes: number; exceeded: boolean } {
  const nextBytes = currentBytes + chunk.byteLength;
  if (nextBytes <= maxBytes) {
    chunks.push(chunk);
    return { bytes: nextBytes, exceeded: false };
  }

  const remainingBytes = Math.max(0, maxBytes - currentBytes);
  if (remainingBytes > 0) {
    chunks.push(chunk.subarray(0, remainingBytes));
  }

  return { bytes: maxBytes, exceeded: true };
}

export const runProcess: RunProcess = async ({
  command,
  args,
  cwd,
  timeoutMs,
  maxStdoutBytes = DEFAULT_STDOUT_LIMIT,
  maxStderrBytes = DEFAULT_STDERR_LIMIT,
  env,
}) =>
  new Promise((resolve, reject) => {
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let timedOut = false;
    let outputExceeded = false;
    let killTimer: NodeJS.Timeout | undefined;

    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...env },
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      killTimer = setTimeout(() => child.kill("SIGKILL"), 1_000);
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      const result = appendChunk(
        stdoutChunks,
        chunk,
        stdoutBytes,
        maxStdoutBytes,
      );
      stdoutBytes = result.bytes;
      outputExceeded = outputExceeded || result.exceeded;
      if (result.exceeded) child.kill("SIGTERM");
    });

    child.stderr.on("data", (chunk: Buffer) => {
      const result = appendChunk(
        stderrChunks,
        chunk,
        stderrBytes,
        maxStderrBytes,
      );
      stderrBytes = result.bytes;
      outputExceeded = outputExceeded || result.exceeded;
      if (result.exceeded) child.kill("SIGTERM");
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      if (killTimer) clearTimeout(killTimer);
      reject(error);
    });

    child.on("close", (exitCode, signal) => {
      clearTimeout(timeout);
      if (killTimer) clearTimeout(killTimer);

      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      const stderr = Buffer.concat(stderrChunks).toString("utf8");

      if (timedOut) {
        reject(new Error(`Process timed out after ${timeoutMs}ms`));
        return;
      }

      if (outputExceeded) {
        reject(new Error("Process output exceeded the configured limit"));
        return;
      }

      if (exitCode !== 0) {
        reject(new Error(stderr || `Process exited with code ${exitCode}`));
        return;
      }

      resolve({ stdout, stderr, exitCode, signal });
    });
  });
