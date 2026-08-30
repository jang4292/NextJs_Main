import type { MapCoordinates, MapPlace } from "@/features/maps/domain/types";
import { loadScript } from "@/features/maps/presentation/sdk/loadScript";
import type {
  MapAdapter,
  MapSdkWindow,
} from "@/features/maps/presentation/sdk/types";

const KAKAO_MAP_URL = (appKey: string) =>
  `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;

export async function createKakaoMapAdapter(
  container: HTMLElement,
  center: MapCoordinates,
): Promise<MapAdapter> {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  if (!appKey) {
    throw new Error("KAKAO_MAP_KEY_MISSING");
  }

  await loadScript(KAKAO_MAP_URL(appKey));

  const windowWithKakao = window as MapSdkWindow;
  const kakaoMaps = windowWithKakao.kakao?.maps;
  if (!kakaoMaps) {
    throw new Error("KAKAO_MAP_SDK_UNAVAILABLE");
  }

  await new Promise<void>((resolve, reject) => {
    kakaoMaps.load(() => resolve());
    setTimeout(() => reject(new Error("KAKAO_MAP_SDK_TIMEOUT")), 10000);
  });

  let marker: { setMap: (map: unknown) => void } | null = null;
  const map = new kakaoMaps.Map(container, {
    center: new kakaoMaps.LatLng(center.lat, center.lng),
    level: 4,
  });

  return {
    setCenter(nextCenter: MapCoordinates) {
      map.setCenter(new kakaoMaps.LatLng(nextCenter.lat, nextCenter.lng));
    },
    setMarker(place: MapPlace) {
      if (marker) {
        marker.setMap(null);
      }
      marker = new kakaoMaps.Marker({
        map,
        position: new kakaoMaps.LatLng(
          place.coordinates.lat,
          place.coordinates.lng,
        ),
      });
      map.setCenter(
        new kakaoMaps.LatLng(place.coordinates.lat, place.coordinates.lng),
      );
    },
    destroy() {
      if (marker) {
        marker.setMap(null);
      }
    },
  };
}
