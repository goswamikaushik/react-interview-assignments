export const SITE_ROUTES = {
  HOME: "/",
  PROJECT_03: "/project-03-movie-search",
  BOOKMARKS: "/bookmarks",
  PROJECT_01: "/project-01-shopping-cart",
};

export const MAIN_PATHS = Object.values(SITE_ROUTES).filter((r) =>
  r.startsWith("/project-"),
);
