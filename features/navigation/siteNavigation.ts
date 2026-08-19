export type NavigationKey =
  "home" | "tools" | "learn" | "games" | "about" | "contact";

export type SiteNavigationItem = {
  key: NavigationKey;
  label: string;
  href: string;
  description: string;
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
    key: "about",
    label: "About",
    href: "/about",
    description: "Profile and external links",
  },
  {
    key: "contact",
    label: "Contact",
    href: "/contact",
    description: "Email contact form",
  },
];

export const bottomNavigation: SiteNavigationItem[] = [
  siteNavigation[0],
  siteNavigation[1],
  siteNavigation[2],
  {
    key: "games",
    label: "Games",
    href: "/tools/games",
    description: "Mini-game collection",
  },
  siteNavigation[3],
];

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
