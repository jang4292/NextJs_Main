export type NavigationKey = "home" | "tools" | "learn" | "profile";

export type SiteNavigationItem = {
  key: NavigationKey;
  label: string;
  href: string;
  description: string;
  relatedHrefs?: string[];
};

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: false;
};

export const siteNavigation: SiteNavigationItem[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    description: "Interactive Lab home",
  },
  {
    key: "tools",
    label: "Tools",
    href: "/tools",
    description: "Music, games, and practical calculators",
  },
  {
    key: "learn",
    label: "Learn",
    href: "/learn",
    description: "Blog posts and learning content",
  },
  {
    key: "profile",
    label: "Profile",
    href: "/about",
    description: "Profile, external links, and contact",
    relatedHrefs: ["/contact"],
  },
];

export const bottomNavigation: SiteNavigationItem[] = siteNavigation;

export function isNavigationItemActive(
  pathname: string,
  item: SiteNavigationItem,
) {
  return [item.href, ...(item.relatedHrefs ?? [])].some((href) =>
    isActivePath(pathname, href),
  );
}

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export const legacyRedirects: LegacyRedirect[] = [
  { source: "/music-list", destination: "/tools/music", permanent: false },
  {
    source: "/DJ_Play_List",
    destination: "/tools/music?mode=custom",
    permanent: false,
  },
  {
    source: "/dj-play-list",
    destination: "/tools/music?mode=custom",
    permanent: false,
  },
  {
    source: "/tax-calculator",
    destination: "/tools/tax-calculator",
    permanent: false,
  },
  { source: "/games", destination: "/tools/games", permanent: false },
  {
    source: "/games/:slug*",
    destination: "/tools/games/:slug*",
    permanent: false,
  },
  { source: "/blog", destination: "/learn/blog", permanent: false },
  {
    source: "/blog/:slug*",
    destination: "/learn/blog/:slug*",
    permanent: false,
  },
  {
    source: "/projects/idioms",
    destination: "/learn/idioms",
    permanent: false,
  },
  {
    source: "/projects/idioms/:slug*",
    destination: "/learn/idioms/:slug*",
    permanent: false,
  },
  {
    source: "/projects/english-vocabulary",
    destination: "/learn/vocabulary",
    permanent: false,
  },
  {
    source: "/projects/japanese-vocabulary",
    destination: "/learn/japanese-vocabulary",
    permanent: false,
  },
  { source: "/projects", destination: "/tools", permanent: false },
  { source: "/projects/:slug*", destination: "/tools", permanent: false },
];
