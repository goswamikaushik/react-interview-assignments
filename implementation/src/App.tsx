import { Route, Routes } from "react-router";
import { Home, MovieDetails, MovieSearch, ShoppingCart } from "./features";
import { SITE_ROUTES } from "./constants";
import BookmarksPage from "./features/project-03-movie-search-app/bookmark";

const { PROJECT_03, PROJECT_01, HOME, BOOKMARKS } = SITE_ROUTES;

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Home />} />
      <Route path={PROJECT_01} element={<ShoppingCart />} />
      <Route path={PROJECT_03}>
        <Route index element={<MovieSearch />} />
        <Route path=":imdbId" element={<MovieDetails />} />
        <Route path={`${PROJECT_03}${BOOKMARKS}`} element={<BookmarksPage />} />
      </Route>
    </Routes>
  );
}

export default App;
