const DEFAULT_AUDIO_BASE_URL =
  "https://audiofilestudy.s3.ap-northeast-2.amazonaws.com";
const DEFAULT_SITE_URL = "http://localhost:3000";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  receiverEmail: string;
}

export interface AdminCredentialsConfig {
  username: string;
  passwordHash: string;
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

function withProtocol(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  return `https://${value}`;
}

export function getSiteUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  return value ? withProtocol(value).replace(/\/$/, "") : DEFAULT_SITE_URL;
}

export function getAudioBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_AUDIO_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_AUDIO_BASE_URL
  );
}

export function getMapProviderConfig() {
  return {
    naverClientId: process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? "",
    kakaoAppKey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "",
    naverSearchClientId: process.env.NAVER_SEARCH_CLIENT_ID ?? "",
    naverSearchClientSecret: process.env.NAVER_SEARCH_CLIENT_SECRET ?? "",
    kakaoRestApiKey: process.env.KAKAO_REST_API_KEY ?? "",
  };
}

export function getSessionSecret(): string {
  return getRequiredEnv("SESSION_SECRET");
}

export function getAdminCredentialsConfig(): AdminCredentialsConfig {
  return {
    username: getRequiredEnv("ADMIN_USERNAME"),
    passwordHash: getRequiredEnv("ADMIN_PASSWORD_HASH"),
  };
}

export function getSmtpConfig(): SmtpConfig {
  const rawPort = getRequiredEnv("SMTP_PORT");
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`SMTP_PORT must be a valid TCP port: ${rawPort}`);
  }

  return {
    host: getRequiredEnv("SMTP_HOST"),
    port,
    secure: process.env.SMTP_SECURE === "true",
    user: getRequiredEnv("SMTP_USER"),
    pass: getRequiredEnv("SMTP_PASS"),
    receiverEmail: getRequiredEnv("RECEIVER_EMAIL"),
  };
}
