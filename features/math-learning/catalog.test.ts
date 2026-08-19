import { describe, expect, it } from "vitest";
import {
  ARITHMETIC_LEARNING_HREF,
  PROBABILITY_LEARNING_HREF,
  SEQUENCES_LEARNING_HREF,
  STATISTICS_LEARNING_HREF,
  getAvailableMathSubjects,
  mathSubjectCatalog,
} from "./catalog";

describe("mathSubjectCatalog", () => {
  it("keeps subject ids unique", () => {
    const ids = mathSubjectCatalog.map((subject) => subject.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("links only available subjects to implemented learning experiences", () => {
    const availableSubjects = getAvailableMathSubjects();

    expect(availableSubjects).toHaveLength(4);
    expect(availableSubjects.map((subject) => subject.id)).toEqual([
      "arithmetic",
      "sequences",
      "statistics",
      "probability",
    ]);
    expect(availableSubjects[0]).toMatchObject({
      id: "arithmetic",
      href: ARITHMETIC_LEARNING_HREF,
      status: "available",
    });
    expect(availableSubjects[0].topics).toEqual(
      expect.arrayContaining([
        "덧셈 6단계",
        "뺄셈 5단계",
        "곱셈 3단계",
        "나눗셈 1단계",
      ]),
    );
    expect(availableSubjects[1]).toMatchObject({
      id: "sequences",
      href: SEQUENCES_LEARNING_HREF,
      status: "available",
    });
    expect(availableSubjects[2]).toMatchObject({
      id: "statistics",
      href: STATISTICS_LEARNING_HREF,
      status: "available",
    });
    expect(availableSubjects[2].topics).toEqual(
      expect.arrayContaining([
        "합계",
        "최댓값",
        "최솟값",
        "평균",
        "중앙값",
        "최빈값",
      ]),
    );
    expect(availableSubjects[3]).toMatchObject({
      id: "probability",
      href: PROBABILITY_LEARNING_HREF,
      status: "available",
    });
    expect(availableSubjects[3].topics).toEqual(
      expect.arrayContaining([
        "전체 경우 수",
        "유리한 경우 수",
        "동전",
        "주사위",
        "색 공 뽑기",
      ]),
    );
    expect(
      mathSubjectCatalog
        .filter((subject) => subject.status === "coming-soon")
        .every((subject) => subject.href === undefined),
    ).toBe(true);
  });
});
