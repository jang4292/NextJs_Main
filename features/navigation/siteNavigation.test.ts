import { describe, expect, it } from "vitest";
import {
  bottomNavigation,
  legacyRedirects,
  siteNavigation,
} from "./siteNavigation";

describe("siteNavigation", () => {
  it("keeps top-level navigation hrefs unique", () => {
    const hrefs = siteNavigation.map((item) => item.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("keeps bottom navigation focused on the interactive routes", () => {
    expect(bottomNavigation.map((item) => item.href)).toEqual([
      "/",
      "/tools",
      "/learn",
      "/tools/games",
      "/about",
    ]);
  });

  it("documents temporary legacy redirects for the old public URLs", () => {
    expect(legacyRedirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/music-list",
          destination: "/tools/music",
          permanent: false,
        }),
        expect.objectContaining({
          source: "/DJ_Play_List",
          destination: "/tools/music?mode=custom",
          permanent: false,
        }),
        expect.objectContaining({
          source: "/dj-play-list",
          destination: "/tools/music?mode=custom",
          permanent: false,
        }),
        expect.objectContaining({
          source: "/games/:slug*",
          destination: "/tools/games/:slug*",
          permanent: false,
        }),
        expect.objectContaining({
          source: "/projects/japanese-vocabulary",
          destination: "/learn/japanese-vocabulary",
          permanent: false,
        }),
      ]),
    );
  });
});
