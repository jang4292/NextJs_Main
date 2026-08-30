import type { MapPlace, MapProvider } from "@/features/maps/domain/types";

interface NaverLocalItem {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

interface NaverLocalResponse {
  items?: NaverLocalItem[];
}

export async function searchNaverPlaces(query: string): Promise<MapPlace[]> {
  const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
  const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("MAP_PROVIDER_UNAVAILABLE");
  }

  const response = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5&sort=comment`,
    {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`NAVER_SEARCH_FAILED_${response.status}`);
  }

  const payload = (await response.json()) as NaverLocalResponse;
  const items = payload.items ?? [];

  return items.map((item, index) => {
    const lat = Number(item.mapy ?? 0) / 1_000_000;
    const lng = Number(item.mapx ?? 0) / 1_000_000;

    return {
      id: `naver-${index}-${item.link ?? item.title}`,
      provider: "naver" as MapProvider,
      name: stripHtml(item.title),
      address: item.roadAddress || item.address || "주소 정보 없음",
      phone: item.telephone || undefined,
      category: item.category || undefined,
      url: item.link || undefined,
      coordinates: {
        lat: Number.isFinite(lat) ? lat : 37.5665,
        lng: Number.isFinite(lng) ? lng : 126.978,
      },
    };
  });
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").trim();
}
