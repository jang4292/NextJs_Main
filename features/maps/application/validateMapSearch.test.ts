import { describe, expect, it } from "vitest";
import {
  validateMapSearch,
  type MapSearchValidation,
} from "./validateMapSearch";

describe("validateMapSearch", () => {
  it("accepts a valid provider and trimmed query", () => {
    const result = validateMapSearch({
      query: "  서울역  ",
      provider: "naver",
    });

    expect(result).toMatchObject<MapSearchValidation>({
      query: "서울역",
      provider: "naver",
      valid: true,
    });
  });

  it("rejects queries shorter than two characters", () => {
    const result = validateMapSearch({ query: "s", provider: "kakao" });

    expect(result.valid).toBe(false);
    expect(result.error).toBe("검색어는 2자 이상 입력해주세요.");
  });

  it("rejects unsupported providers", () => {
    const result = validateMapSearch({
      query: "서울역",
      provider: "google" as never,
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe("지원하지 않는 지도 제공자입니다.");
  });
});
