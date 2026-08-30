import { MAP_PROVIDERS, type MapProvider } from "@/features/maps/domain/types";

export interface MapSearchValidation {
  valid: boolean;
  provider: MapProvider;
  query: string;
  error?: string;
}

export function validateMapSearch({
  query,
  provider,
}: {
  query: string;
  provider: string;
}): MapSearchValidation {
  const normalizedProvider = String(provider ?? "")
    .trim()
    .toLowerCase() as MapProvider;
  const normalizedQuery = String(query ?? "").trim();

  if (!MAP_PROVIDERS.includes(normalizedProvider)) {
    return {
      valid: false,
      provider: "naver",
      query: normalizedQuery,
      error: "지원하지 않는 지도 제공자입니다.",
    };
  }

  if (normalizedQuery.length < 2) {
    return {
      valid: false,
      provider: normalizedProvider,
      query: normalizedQuery,
      error: "검색어는 2자 이상 입력해주세요.",
    };
  }

  if (normalizedQuery.length > 100) {
    return {
      valid: false,
      provider: normalizedProvider,
      query: normalizedQuery,
      error: "검색어는 100자 이내로 입력해주세요.",
    };
  }

  return {
    valid: true,
    provider: normalizedProvider,
    query: normalizedQuery,
  };
}
