import { describe, expect, it } from "vitest";
import {
  bottomNavigation,
  isNavigationItemActive,
  legacyRedirects,
  siteNavigation,
} from "./siteNavigation";

describe("siteNavigation", () => {
  it("keeps top-level navigation hrefs unique", () => {
    const hrefs = siteNavigation.map((item) => item.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses the same four primary routes for top and bottom navigation", () => {
    const expectedHrefs = ["/", "/tools", "/learn", "/about"];

    expect(siteNavigation.map((item) => item.href)).toEqual(expectedHrefs);
    expect(bottomNavigation.map((item) => item.href)).toEqual([
      ...expectedHrefs,
    ]);
  });

  it("keeps contact active under the Profile primary navigation item", () => {
    const profileItem = siteNavigation.find((item) => item.key === "profile");

    expect(profileItem).toBeDefined();
    expect(isNavigationItemActive("/contact", profileItem!)).toBe(true);
    expect(isNavigationItemActive("/contact", siteNavigation[0])).toBe(false);
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
