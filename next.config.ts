import type { NextConfig } from "next";
import { legacyRedirects } from "./features/navigation/siteNavigation";

const isDevelopment = process.env.NODE_ENV === "development";
const defaultAllowedDevOrigins = ["172.30.1.23", "172.30.1.60"];
const allowedDevOrigins = parseAllowedDevOrigins(
  process.env.NEXT_ALLOWED_DEV_ORIGINS,
);
const connectSrc = isDevelopment
  ? "connect-src 'self' http: https: ws: wss:"
  : "connect-src 'self'";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' https://openapi.map.naver.com https://oapi.map.naver.com https://t1.daumcdn.net https://dapi.kakao.com ${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://img.shields.io https://visitor-badge.laobi.icu https://i.ytimg.com https://i9.ytimg.com https://*.naver.com https://*.kakao.com https://*.daumcdn.net",
  "font-src 'self'",
  connectSrc,
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  ...(isDevelopment
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]),
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isDevelopment ? { allowedDevOrigins } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.shields.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i9.ytimg.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;

function parseAllowedDevOrigins(value: string | undefined): string[] {
  const configuredOrigins =
    value
      ?.split(",")
      .map(normalizeDevOrigin)
      .filter((origin): origin is string => Boolean(origin)) ?? [];

  return Array.from(
    new Set([...defaultAllowedDevOrigins, ...configuredOrigins]),
  );
}

function normalizeDevOrigin(value: string): string | null {
  const trimmed = value.trim().replace(/\/$/, "");

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//.test(trimmed)) {
    try {
      return new URL(trimmed).hostname;
    } catch {
      return null;
    }
  }

  return trimmed.replace(/:\d+$/, "");
}
