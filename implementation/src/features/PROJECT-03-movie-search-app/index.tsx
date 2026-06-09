import { useEffect, useState } from "react";
import type { MoviesData } from "./type";
import { useDebounce } from "../../hooks";

const MovieSearch = () => {
  const [moviesData, setMoviesData] = useState<MoviesData>({
    data: [],
    isLoading: false,
    search: "",
  });

  const searchText = moviesData.search;
  console.log("debpunce-text", moviesData.search);
  const movies = moviesData.data;
  const isLoading = moviesData.isLoading;
  const debounceText = useDebounce(searchText);

  console.log("debpunce-text", debounceText);

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
    setMoviesData((prev) => ({ ...prev, [action]: v }));
  };

  return (
    <div>
      <input
        type="text"
        autoFocus
        onChange={(e) => onChange(e.target.value, "search")}
        value={searchText}
        placeholder="Search Movie By Title"
      />
      {!searchText && <p>Search for a movie to get started</p>}
      <div className="movie-list">
        {isLoading ? (
          <p>Fetching Movies</p>
        ) : (
          movies.map((m) => (
            <div key={m.imdbID}>
              <img src={m.Poster} alt={`${m.Title}'s Image`} />
              <p>{m.Title}</p>
              <p>{`${m.Type} - ${m.Year}`}</p>
            </div>
          ))
        )}
        {searchText && !isLoading && movies.length === 0 && (
          <p>{`No results found for '${searchText}'`}</p>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;

// As user types → debounced search fires after 300ms
// Show loading spinner during API call (or during filter if using mock)
// Show error if API fails
// Show "No results found for '...'" if API returns empty
// Results rendered as a grid of MovieCard components
// F2 — MovieCard
// Each card shows:

// Movie poster (Poster field) — fallback image if poster is "N/A"
// Title
// Year
// IMDb rating (if available)
// Bookmark button (filled icon = bookmarked, outline = not bookmarked)
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
