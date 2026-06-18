export const SITE_ROUTES = {
  HOME: "/",
  PROJECT_01: "/project-01-shopping-cart",
  PROJECT_02: "/project-02-todo-app-pro",
  PROJECT_03: "/project-03-movie-search",
  BOOKMARKS: "/bookmarks",
};

export const MAIN_PATHS = Object.values(SITE_ROUTES).filter((r) =>
  r.startsWith("/project-"),
);
