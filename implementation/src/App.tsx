import { Navigate, Route, Routes } from "react-router";
import { MovieDetails, MovieSearch } from "./features";
import { SITE_ROUTES } from "./constants";
import BookmarksPage from "./features/project-03-movie-search-app/bookmark";

const { PROJECT_03, HOME, BOOKMARKS } = SITE_ROUTES;

function App() {
  return (
    <Routes>
      <Route path={HOME} element={<Navigate replace to={PROJECT_03} />} />
      <Route path={PROJECT_03}>
        <Route index element={<MovieSearch />} />
        <Route path=":imdbId" element={<MovieDetails />} />
        <Route
          path={`${PROJECT_03}/${BOOKMARKS}`}
          element={<BookmarksPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
