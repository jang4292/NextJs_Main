import type { MapCoordinates, MapPlace } from "@/features/maps/domain/types";
import { loadScript } from "@/features/maps/presentation/sdk/loadScript";
import type {
  MapAdapter,
  MapSdkWindow,
} from "@/features/maps/presentation/sdk/types";

const NAVER_MAP_URL = (clientId: string) =>
  `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;

export async function createNaverMapAdapter(
  container: HTMLElement,
  center: MapCoordinates,
): Promise<MapAdapter> {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  if (!clientId) {
    throw new Error("NAVER_MAP_KEY_MISSING");
  }

  await loadScript(NAVER_MAP_URL(clientId));

  const windowWithNaver = window as MapSdkWindow;
  const naverMaps = windowWithNaver.naver?.maps;
  if (!naverMaps) {
    throw new Error("NAVER_MAP_SDK_UNAVAILABLE");
  }

  let marker: { setMap: (map: unknown) => void } | null = null;
  const map = new naverMaps.Map(container, {
    center: new naverMaps.LatLng(center.lat, center.lng),
    zoom: 14,
    minZoom: 7,
    maxZoom: 19,
  }) as {
    setCenter: (center: { lat: number; lng: number }) => void;
    destroy: () => void;
  };

  return {
    setCenter(nextCenter: MapCoordinates) {
      map.setCenter(new naverMaps.LatLng(nextCenter.lat, nextCenter.lng));
    },
    setMarker(place: MapPlace) {
      if (marker) {
        marker.setMap(null);
      }
      marker = new naverMaps.Marker({
        map,
        position: new naverMaps.LatLng(
          place.coordinates.lat,
          place.coordinates.lng,
        ),
      });
      map.setCenter(
        new naverMaps.LatLng(place.coordinates.lat, place.coordinates.lng),
      );
    },
    destroy() {
      if (marker) {
        marker.setMap(null);
      }
      map.destroy?.();
    },
  };
}
