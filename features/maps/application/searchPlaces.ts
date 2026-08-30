import { type MapPlace, type MapProvider } from "@/features/maps/domain/types";
import { searchKakaoPlaces } from "@/features/maps/infrastructure/kakaoPlaceSearch";
import { searchNaverPlaces } from "@/features/maps/infrastructure/naverPlaceSearch";
import { validateMapSearch } from "@/features/maps/application/validateMapSearch";

export type MapSearchErrorCode =
  | "INVALID_QUERY"
  | "INVALID_PROVIDER"
  | "PROVIDER_UNAVAILABLE"
  | "UPSTREAM_FAILED"
  | "EMPTY_RESULT";

export interface MapSearchError {
  code: MapSearchErrorCode;
  message: string;
}

export async function searchPlaces({
  query,
  provider,
}: {
  query: string;
  provider: MapProvider | string;
}): Promise<{ places: MapPlace[] }> {
  const validation = validateMapSearch({ query, provider });

  if (!validation.valid) {
    throw {
      code: validation.error?.includes("지원하지")
        ? "INVALID_PROVIDER"
        : "INVALID_QUERY",
      message: validation.error ?? "검색 형식이 올바르지 않습니다.",
    } satisfies MapSearchError;
  }

  try {
    const places =
      validation.provider === "naver"
        ? await searchNaverPlaces(validation.query)
        : await searchKakaoPlaces(validation.query);

    if (!places.length) {
      throw {
        code: "EMPTY_RESULT",
        message: "검색 결과가 없습니다. 다른 키워드로 다시 시도해보세요.",
      } satisfies MapSearchError;
    }

    return { places };
  } catch (error) {
    const candidate = error as Partial<MapSearchError> & { message?: string };

    if (
      candidate.code === "EMPTY_RESULT" ||
      candidate.code === "INVALID_QUERY"
    ) {
      throw candidate;
    }

    if (candidate.message === "MAP_PROVIDER_UNAVAILABLE") {
      throw {
        code: "PROVIDER_UNAVAILABLE",
        message: "해당 지도 제공자의 설정이 아직 준비되지 않았습니다.",
      } satisfies MapSearchError;
    }

    throw {
      code: "UPSTREAM_FAILED",
      message: "지도 검색에 실패했습니다. 잠시 후 다시 시도해주세요.",
    } satisfies MapSearchError;
  }
}
