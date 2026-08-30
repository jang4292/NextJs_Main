"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MapPlace, MapProvider } from "@/features/maps/domain/types";
import { createKakaoMapAdapter } from "@/features/maps/presentation/sdk/KakaoMapAdapter";
import { createNaverMapAdapter } from "@/features/maps/presentation/sdk/NaverMapAdapter";
import type { MapAdapter } from "@/features/maps/presentation/sdk/types";

const PROVIDER_OPTIONS: Array<{ value: MapProvider; label: string }> = [
  { value: "naver", label: "Naver Map" },
  { value: "kakao", label: "Kakao Map" },
];

interface MapExplorerProps {
  initialProvider?: MapProvider;
}

export function MapExplorer({ initialProvider = "naver" }: MapExplorerProps) {
  const [provider, setProvider] = useState<MapProvider>(initialProvider);
  const [query, setQuery] = useState("서울역");
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapState, setMapState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapAdapterRef = useRef<MapAdapter | null>(null);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId) ?? places[0] ?? null,
    [places, selectedId],
  );

  useEffect(() => {
    if (!selectedPlace || !mapContainerRef.current) {
      setMapState("idle");
      return;
    }

    let cancelled = false;
    setMapState("loading");
    setMapError(null);

    const renderMap = async () => {
      try {
        const adapter =
          provider === "naver"
            ? await createNaverMapAdapter(
                mapContainerRef.current!,
                selectedPlace.coordinates,
              )
            : await createKakaoMapAdapter(
                mapContainerRef.current!,
                selectedPlace.coordinates,
              );

        if (cancelled) {
          adapter.destroy();
          return;
        }

        mapAdapterRef.current?.destroy();
        mapAdapterRef.current = adapter;
        adapter.setMarker(selectedPlace);
        setMapState("ready");
      } catch (mapFailure) {
        const nextError =
          mapFailure instanceof Error
            ? mapFailure.message
            : "지도 로딩에 실패했습니다.";

        if (!cancelled) {
          setMapError(nextError);
          setMapState("error");
        }
      }
    };

    void renderMap();

    return () => {
      cancelled = true;
      mapAdapterRef.current?.destroy();
      mapAdapterRef.current = null;
    };
  }, [provider, selectedPlace]);

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setError("검색어는 2자 이상 입력해주세요.");
      setPlaces([]);
      setSelectedId(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/maps/search?provider=${encodeURIComponent(provider)}&query=${encodeURIComponent(trimmed)}`,
      );
      const payload = (await response.json()) as {
        message?: string;
        places?: MapPlace[];
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "검색에 실패했습니다.");
      }

      const nextPlaces = payload.places ?? [];
      setPlaces(nextPlaces);
      setSelectedId(nextPlaces[0]?.id ?? null);
      if (!nextPlaces.length) {
        setError("검색 결과가 없습니다. 다른 키워드로 다시 시도해보세요.");
      }
    } catch (searchError) {
      const message =
        searchError instanceof Error
          ? searchError.message
          : "지도 검색에 실패했습니다.";
      setError(message);
      setPlaces([]);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  }, [provider, query]);

  const handleSelectPlace = useCallback((place: MapPlace) => {
    setSelectedId(place.id);
  }, []);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
        <label className="flex-1">
          <span className="mb-2 block text-sm font-medium text-neutral-700">
            지도 제공자
          </span>
          <select
            aria-label="지도 제공자 선택"
            value={provider}
            onChange={(event) => setProvider(event.target.value as MapProvider)}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-0 outline-none"
          >
            {PROVIDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-[2]">
          <span className="mb-2 block text-sm font-medium text-neutral-700">
            장소 검색
          </span>
          <div className="flex gap-2">
            <input
              aria-label="장소 검색어"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="예: 서울역, 강남역"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {loading ? "검색 중" : "검색"}
            </button>
          </div>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          <h3 className="mb-3 text-lg font-semibold text-neutral-900">
            검색 결과
          </h3>
          {error && (
            <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {error}
            </p>
          )}

          {!loading && !error && places.length === 0 ? (
            <p className="text-sm text-neutral-500">검색 결과가 없습니다.</p>
          ) : null}

          <ul className="space-y-2">
            {places.map((place) => {
              const isSelected = place.id === selectedId;
              return (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                    }`}
                  >
                    <div className="text-sm font-semibold">{place.name}</div>
                    <div className="mt-1 text-xs opacity-80">
                      {place.address}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="space-y-4">
          <div
            ref={mapContainerRef}
            aria-label="지도 영역"
            className="flex h-[420px] items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-[radial-gradient(circle_at_center,_#f5f5f5,_#e5e5e5)] text-sm text-neutral-500"
          >
            {mapState === "loading"
              ? "지도 데이터를 불러오는 중입니다..."
              : null}
            {mapState === "idle"
              ? "검색 결과를 선택하면 지도가 표시됩니다."
              : null}
            {mapState === "error" && mapError ? (
              <div className="px-4 text-center text-amber-700">{mapError}</div>
            ) : null}
          </div>

          {selectedPlace ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                {selectedPlace.name}
              </h3>
              <p className="mt-2 text-sm text-neutral-700">
                {selectedPlace.address}
              </p>
              {selectedPlace.phone ? (
                <p className="mt-2 text-sm text-neutral-700">
                  전화: {selectedPlace.phone}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedPlace.url ? (
                  <a
                    href={selectedPlace.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900"
                  >
                    장소 상세 보기
                  </a>
                ) : null}
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(selectedPlace.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900"
                >
                  네이버 길찾기
                </a>
                <a
                  href={`https://map.kakao.com/link/to/${encodeURIComponent(selectedPlace.name)},${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900"
                >
                  카카오 길찾기
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
