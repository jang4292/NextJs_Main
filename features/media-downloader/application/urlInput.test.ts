import { describe, expect, it } from "vitest";
import { extractMediaUrlCandidate } from "./urlInput";

describe("extractMediaUrlCandidate", () => {
  it("returns plain HTTPS URLs unchanged", () => {
    expect(
      extractMediaUrlCandidate(
        "https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA",
      ),
    ).toBe("https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA");
  });

  it("unwraps quoted URLs", () => {
    expect(
      extractMediaUrlCandidate(
        "'https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA'",
      ),
    ).toBe("https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA");
  });

  it("extracts URLs from Markdown links", () => {
    expect(
      extractMediaUrlCandidate(
        "[https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA](https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA)",
      ),
    ).toBe("https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA");
  });

  it("extracts URLs from quote-wrapped Markdown copied from chat", () => {
    expect(
      extractMediaUrlCandidate(
        "'[https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA'](https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA')",
      ),
    ).toBe("https://youtu.be/sCk-huN2ULg?si=OgSE-P3WLHGgepBA");
  });

  it("returns an empty candidate when no HTTPS URL is present", () => {
    expect(extractMediaUrlCandidate("not a url")).toBe("");
  });
});
