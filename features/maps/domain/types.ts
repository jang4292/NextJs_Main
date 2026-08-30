export const MAP_PROVIDERS = ["naver", "kakao"] as const;

export type MapProvider = (typeof MAP_PROVIDERS)[number];

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapPlace {
  id: string;
  provider: MapProvider;
  name: string;
  address: string;
  phone?: string;
  category?: string;
  url?: string;
  coordinates: MapCoordinates;
}

export interface MapSearchResult {
  provider: MapProvider;
  query: string;
  places: MapPlace[];
}

export interface MapViewport {
  center: MapCoordinates;
  zoom: number;
}
