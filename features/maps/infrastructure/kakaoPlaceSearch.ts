import type { MapPlace, MapProvider } from "@/features/maps/domain/types";

interface KakaoPlaceItem {
  id: number;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  category_name: string;
  place_url: string;
  x: string;
  y: string;
}

interface KakaoLocalResponse {
  documents?: KakaoPlaceItem[];
}

export async function searchKakaoPlaces(query: string): Promise<MapPlace[]> {
  const apiKey = process.env.KAKAO_REST_API_KEY;

  if (!apiKey) {
    throw new Error("MAP_PROVIDER_UNAVAILABLE");
  }

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=5`,
    {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`KAKAO_SEARCH_FAILED_${response.status}`);
  }

  const payload = (await response.json()) as KakaoLocalResponse;
  const items = payload.documents ?? [];

  return items.map((item, index) => {
    const lng = Number(item.x ?? 126.978);
    const lat = Number(item.y ?? 37.5665);

    return {
      id: `kakao-${item.id ?? index}`,
      provider: "kakao" as MapProvider,
      name: item.place_name,
      address: item.road_address_name || item.address_name || "주소 정보 없음",
      phone: item.phone || undefined,
      category: item.category_name || undefined,
      url: item.place_url || undefined,
      coordinates: {
        lat: Number.isFinite(lat) ? lat : 37.5665,
        lng: Number.isFinite(lng) ? lng : 126.978,
      },
    };
  });
}
