import { useEffect, useState } from "react";
import type { MoviesData } from "./type";
import { useDebounce } from "../../hooks";
import { Spinner } from "../../icons";

const MovieSearch = () => {
  const [moviesData, setMoviesData] = useState<MoviesData>({
    data: [],
    isLoading: false,
    search: "",
    bookmarked: [],
  });

  const searchText = moviesData.search;
  const movies = moviesData.data;
  const isLoading = moviesData.isLoading;
  const debounceText = useDebounce(searchText);
  const bookmarkedIds = moviesData.bookmarked;

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

  const onChange = (v: string, action: "search" | "bookmark") => {
    switch (action) {
      case "bookmark":
        return setMoviesData((prev) => {
          const existIds = prev.bookmarked;
          return {
            ...prev,
            bookmarked: existIds.includes(v)
              ? existIds.filter((id) => id !== v)
              : [...existIds, v],
          };
        });
      default:
        return setMoviesData((prev) => ({ ...prev, [action]: v }));
    }
  };

  const isBookMarked = (id: string) => bookmarkedIds.includes(id);

  return (
    <div className="flex flex-col items-center m-10">
      <h1 className="text-4xl font-bold">Movies</h1>
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
      <div className="grid grid-cols-5 gap-2 w-full mt-10">
        {isLoading ? (
          <div className="flex items-center col-span-5 min-h-52 gap-1 justify-center">
            <span>Fetching Movies</span>
            <Spinner />
          </div>
        ) : (
          movies.map((m) => (
            <div key={m.imdbID} className="rounded-t-md border bg-amber-50">
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
                onClick={() => onChange(m.imdbID, "bookmark")}
                className="border-t  w-full p-0.5 bg-green-400 font-semibold"
              >
                {isBookMarked(m.imdbID) ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
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

// Clicking the card navigates to /movie/:imdbID
// Clicking bookmark toggles without navigating
// F3 — Movie Detail Page (/movie/:imdbID)
// Read imdbID from URL params (useParams)
// Fetch full movie detail from API — OR find it in local mock data
// Show loading state while fetching
// Show error if not found
// Display:
// Large poster
// Title + Year + Rated + Runtime
// Genre (as badges/tags)
// Director
// Full plot
// IMDb rating (styled prominently)
// Bookmark button — same toggle behavior as on card
// Back button → navigates to / (preserves search state if possible)
// F4 — Bookmarks Page (/bookmarks)
// Shows all bookmarked movies as a grid
// Empty state: "No bookmarks yet. Start searching and save your favorites."
// Each bookmarked card has a remove bookmark button
// Clicking card navigates to detail page
// F5 — Navigation
// Header with:
// App name / logo
// Link to Home (/)
// Link to Bookmarks (/bookmarks) with count badge: Bookmarks (3)
// Active link visually highlighted
// Use react-router-dom v6
// F6 — Bookmarks Persistence
// Bookmarks stored in localStorage under key "bookmarks"
// Stored as array of full movie objects (not just IDs — so detail page works offline)
// Persist on every change, restore on mount
