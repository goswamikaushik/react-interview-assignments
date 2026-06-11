import { useEffect, useState } from "react";
import type { MoviesData } from "./type";
import { useDebounce } from "../../hooks";
import { Spinner } from "../../icons";
import { Link } from "react-router";
import { SITE_ROUTES } from "../../constants";
import { useBookmarks } from "../../context/bookmark/use-bookmarks";

const { PROJECT_03, BOOKMARKS } = SITE_ROUTES;

const MovieSearch = () => {
  const { isBookmarked, toggleBookmark, bookmarks } = useBookmarks();
  const [moviesData, setMoviesData] = useState<MoviesData>({
    data: [],
    isLoading: false,
    search: "",
  });

  const searchText = moviesData.search;
  const movies = moviesData.data;
  const isLoading = moviesData.isLoading;
  const debounceText = useDebounce(searchText);

  useEffect(() => {
    const fetchMovies = async (query: string) => {
      try {
        setMoviesData((prev) => ({ ...prev, isLoading: true }));
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=779a9a23&s=${query}`,
        );
        const data = await response.json();
        setMoviesData((prev) => ({ ...prev, data: data.Search ?? [] }));
      } catch (error) {
        console.error("Error while fetching movies", error);
      } finally {
        setMoviesData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    const clearMovies = () => setMoviesData((prev) => ({ ...prev, data: [] }));
    if (!debounceText.trim()) {
      clearMovies();
      return;
    }

    fetchMovies(debounceText);
  }, [debounceText]);

  const onChange = (v: string, action: "search") => {
    switch (action) {
      default:
        return setMoviesData((prev) => ({ ...prev, [action]: v }));
    }
  };

  return (
    <div className="flex flex-col items-center m-10 mx-24">
      <h1 className="text-7xl font-bold">Movies</h1>
      <Link
        className="border border-blue-400 px-2 py-0.5 font-semibold rounded-md bg-blue-200"
        to={`${PROJECT_03}${BOOKMARKS}`}
      >
        Bookmarks {`(${bookmarks.length})`}
      </Link>
      <input
        type="text"
        className="self-end p-1 border-black border-2 rounded-md"
        autoFocus
        onChange={(e) => onChange(e.target.value, "search")}
        value={searchText}
        placeholder="Search Movie By Title"
      />
      {!searchText && (
        <p
          className="p-1 cursor-pointer border-2 border-amber-400 bg-amber-200 rounded-md"
          onClick={() => onChange("hulk", "search")}
        >
          Search for a movie to get started
        </p>
      )}
      <div className="grid grid-cols-5 gap-4 w-full mt-10">
        {isLoading ? (
          <div className="flex items-center col-span-5 min-h-52 gap-1 justify-center">
            <span>Fetching Movies</span>
            <Spinner />
          </div>
        ) : (
          movies.map((m) => (
            <Link key={m.imdbID} to={`${PROJECT_03}/${m.imdbID}`}>
              <div className="rounded-t-md border bg-amber-50">
                <img
                  src={m.Poster}
                  alt={`${m.Title}'s Image`}
                  className="w-full h-96 rounded-t-md"
                />
                <div className="text-center my-4">
                  <p className="text-xl font-bold ">{m.Title}</p>
                  <p>{`(${m.Type} - ${m.Year})`}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark(m);
                  }}
                  className={`border-t cursor-pointer  w-full p-0.5 font-semibold ${isBookmarked(m.imdbID) ? "bg-blue-300" : "bg-green-400"} `}
                >
                  {isBookmarked(m.imdbID) ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </Link>
          ))
        )}
        {debounceText && !isLoading && movies.length === 0 && (
          <p className="col-span-5 mt-32 text-center">{`No results found for '${searchText}'`}</p>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
