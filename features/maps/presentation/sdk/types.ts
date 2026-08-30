import type {
  MapCoordinates,
  MapPlace,
  MapProvider,
} from "@/features/maps/domain/types";

export interface MapAdapter {
  setCenter(center: MapCoordinates): void;
  setMarker(place: MapPlace): void;
  destroy(): void;
}

export interface MapAdapterFactory {
  (
    container: HTMLElement,
    provider: MapProvider,
    center: MapCoordinates,
  ): MapAdapter;
}

export type MapSdkWindow = typeof window & {
  naver?: {
    maps?: {
      Map: new (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => {
        setCenter: (center: { lat: number; lng: number }) => void;
        destroy: () => void;
      };
      LatLng: new (lat: number, lng: number) => { lat: number; lng: number };
      Marker: new (options: Record<string, unknown>) => {
        setMap: (map: unknown) => void;
      };
      Event: {
        addListener: (
          target: unknown,
          type: string,
          handler: () => void,
        ) => void;
      };
    };
  };
  kakao?: {
    maps?: {
      load: (callback: () => void) => void;
      Map: new (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => {
        setCenter: (position: unknown) => void;
        setLevel: (level: number) => void;
      };
      LatLng: new (
        lat: number,
        lng: number,
      ) => { getLat: () => number; getLng: () => number };
      Marker: new (options: Record<string, unknown>) => {
        setMap: (map: unknown) => void;
        setPosition: (position: unknown) => void;
      };
    };
  };
};
