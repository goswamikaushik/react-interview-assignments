# 🎬 React Interview Assignment — Project 03
## Movie Search App

> **Time Limit:** 90 minutes  
> **Difficulty:** Medium–Hard  
> **Mock API:** https://www.omdbapi.com (free key) — OR use the mock data provided below  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Mock API Reference](#mock-api-reference)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [Debounce Logic](#debounce-logic)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A movie search and bookmark app. Users can:
- Search movies by title using a live search input
- Browse results in a grid
- Click a movie to see its detail page
- Bookmark / unbookmark movies
- View all bookmarks on a separate page
- Bookmarks persist across refresh

Two pages. React Router required.

---

## Mock API Reference

> **Recommendation:** Use Option B (mock data) — it works immediately, no signup needed, and covers all features. Use Option A only if you want real search practice.

**Option A — OMDB API (real)**

Register free at https://www.omdbapi.com/apikey.aspx — free key sent to email instantly. Takes 2–5 minutes.

| Action | URL |
|---|---|
| Search by title | `https://www.omdbapi.com/?apikey=YOUR_KEY&s=batman&type=movie` |
| Get movie detail | `https://www.omdbapi.com/?apikey=YOUR_KEY&i=tt0372784&plot=full` |

Search response shape:
```json
{
  "Search": [
    {
      "Title": "Batman Begins",
      "Year": "2005",
      "imdbID": "tt0372784",
      "Type": "movie",
      "Poster": "https://..."
    }
  ],
  "totalResults": "42",
  "Response": "True"
}
```

Detail response shape:
```json
{
  "Title": "Batman Begins",
  "Year": "2005",
  "Rated": "PG-13",
  "Genre": "Action, Adventure",
  "Director": "Christopher Nolan",
  "Plot": "After witnessing his parents' murder...",
  "Poster": "https://...",
  "imdbRating": "8.2",
  "Runtime": "140 min",
  "imdbID": "tt0372784",
  "Response": "True"
}
```

**Option B — Mock local data (if no API key)**

Use this static array in `src/data/movies.js` and filter client-side:

```js
export const MOVIES = [
  { imdbID: "tt0372784", Title: "Batman Begins",          Year: "2005", Genre: "Action",   imdbRating: "8.2", Poster: "https://picsum.photos/seed/batman/200/300" },
  { imdbID: "tt0468569", Title: "The Dark Knight",        Year: "2008", Genre: "Action",   imdbRating: "9.0", Poster: "https://picsum.photos/seed/darkknight/200/300" },
  { imdbID: "tt1375666", Title: "Inception",              Year: "2010", Genre: "Sci-Fi",   imdbRating: "8.8", Poster: "https://picsum.photos/seed/inception/200/300" },
  { imdbID: "tt0816692", Title: "Interstellar",           Year: "2014", Genre: "Sci-Fi",   imdbRating: "8.6", Poster: "https://picsum.photos/seed/interstellar/200/300" },
  { imdbID: "tt0110912", Title: "Pulp Fiction",           Year: "1994", Genre: "Crime",    imdbRating: "8.9", Poster: "https://picsum.photos/seed/pulp/200/300" },
  { imdbID: "tt0137523", Title: "Fight Club",             Year: "1999", Genre: "Drama",    imdbRating: "8.8", Poster: "https://picsum.photos/seed/fight/200/300" },
  { imdbID: "tt0109830", Title: "Forrest Gump",           Year: "1994", Genre: "Drama",    imdbRating: "8.8", Poster: "https://picsum.photos/seed/forrest/200/300" },
  { imdbID: "tt0133093", Title: "The Matrix",             Year: "1999", Genre: "Sci-Fi",   imdbRating: "8.7", Poster: "https://picsum.photos/seed/matrix/200/300" },
  { imdbID: "tt1745960", Title: "Top Gun: Maverick",      Year: "2022", Genre: "Action",   imdbRating: "8.3", Poster: "https://picsum.photos/seed/topgun/200/300" },
  { imdbID: "tt1477834", Title: "Aquaman",                Year: "2018", Genre: "Action",   imdbRating: "6.9", Poster: "https://picsum.photos/seed/aquaman/200/300" },
  { imdbID: "tt4154796", Title: "Avengers: Endgame",      Year: "2019", Genre: "Action",   imdbRating: "8.4", Poster: "https://picsum.photos/seed/endgame/200/300" },
  { imdbID: "tt0076759", Title: "Star Wars: A New Hope",  Year: "1977", Genre: "Sci-Fi",   imdbRating: "8.6", Poster: "https://picsum.photos/seed/starwars/200/300" },
]
```

---

## Feature Requirements

### F1 — Home Page (`/`)

- Search input at top — prominent, auto-focused on load
- Default state (no search yet): show a prompt like `"Search for a movie to get started"`
- As user types → debounced search fires after **300ms**
- Show loading spinner during API call (or during filter if using mock)
- Show error if API fails
- Show `"No results found for '...'"` if API returns empty
- Results rendered as a grid of `MovieCard` components

---

### F2 — MovieCard

Each card shows:
- Movie poster (`Poster` field) — fallback image if poster is `"N/A"`
- Title
- Year
- IMDb rating (if available)
- Bookmark button (filled icon = bookmarked, outline = not bookmarked)
- Clicking the card navigates to `/movie/:imdbID`
- Clicking bookmark toggles without navigating

---

### F3 — Movie Detail Page (`/movie/:imdbID`)

- Read `imdbID` from URL params (`useParams`)
- Fetch full movie detail from API — OR find it in local mock data
- Show loading state while fetching
- Show error if not found
- Display:
  - Large poster
  - Title + Year + Rated + Runtime
  - Genre (as badges/tags)
  - Director
  - Full plot
  - IMDb rating (styled prominently)
- Bookmark button — same toggle behavior as on card
- Back button → navigates to `/` (preserves search state if possible)

---

### F4 — Bookmarks Page (`/bookmarks`)

- Shows all bookmarked movies as a grid
- Empty state: `"No bookmarks yet. Start searching and save your favorites."`
- Each bookmarked card has a remove bookmark button
- Clicking card navigates to detail page

---

### F5 — Navigation

- Header with:
  - App name / logo
  - Link to Home (`/`)
  - Link to Bookmarks (`/bookmarks`) with count badge: `Bookmarks (3)`
- Active link visually highlighted
- Use `react-router-dom` v6

---

### F6 — Bookmarks Persistence

- Bookmarks stored in localStorage under key `"bookmarks"`
- Stored as array of full movie objects (not just IDs — so detail page works offline)
- Persist on every change, restore on mount

---

## Constraints

```
1. React Router v6 required — useNavigate, useParams, Link
2. No external state library
3. Search must be debounced — 300ms minimum
   Direct onChange → API call on every keystroke is an automatic deduction
4. Bookmark state must be global (Context or lifted to App level)
   Both Home and Bookmarks pages need it
5. Fallback image required for missing posters
   Poster field can be "N/A" — handle it
6. Loading AND error states required on every fetch
7. No index as key — use imdbID
```

---

## Component Architecture

```
App  (Router wrapper + BookmarkContext)
├── Header
│     ├── NavLink: Home
│     └── NavLink: Bookmarks (with count badge)
│
├── Route: /
│     └── HomePage
│           ├── SearchBar  (debounced)
│           ├── MovieGrid
│           │     └── MovieCard  (× N)
│           └── EmptyState / LoadingSpinner / ErrorMessage
│
├── Route: /movie/:imdbID
│     └── MovieDetailPage
│           ├── BackButton
│           ├── PosterImage
│           ├── MovieInfo
│           └── BookmarkButton
│
└── Route: /bookmarks
      └── BookmarksPage
            ├── MovieGrid
            │     └── MovieCard  (× N)
            └── EmptyState
```

**Global state (BookmarkContext):**
```js
{
  bookmarks: [],           // array of full movie objects
  addBookmark(movie),
  removeBookmark(imdbID),
  isBookmarked(imdbID)     // returns boolean — useful in MovieCard
}
```

---

## Debounce Logic

```js
// hooks/useDebounce.js
import { useState, useEffect } from "react"

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)   // cleanup on next keystroke
  }, [value, delay])

  return debouncedValue
}

// Usage in HomePage:
const [query, setQuery] = useState("")
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (!debouncedQuery.trim()) return
  fetchMovies(debouncedQuery)
}, [debouncedQuery])   // fires only after user stops typing for 300ms
```

---

## localStorage Rules

```js
// BookmarkContext — save on change
useEffect(() => {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
}, [bookmarks])

// On mount — restore
const init = () => {
  try {
    const saved = localStorage.getItem("bookmarks")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}
const [bookmarks, setBookmarks] = useState(init)
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] Search input fetches/filters movies
- [ ] Search is debounced (no call on every keystroke)
- [ ] Loading state shown during search
- [ ] Error state shown on failure
- [ ] Empty state shown when no results
- [ ] MovieCard shows title, year, poster, bookmark button
- [ ] Missing poster shows fallback image
- [ ] Clicking card navigates to `/movie/:imdbID`
- [ ] Detail page shows full movie info
- [ ] Bookmark toggles on both Home and Detail page
- [ ] Bookmarks page shows saved movies
- [ ] Bookmarks count in header is correct
- [ ] Bookmarks persist after refresh
- [ ] Back button works from detail page
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `useDebounce` extracted as a custom hook
- [ ] `React.memo` on `MovieCard`
- [ ] Detail page caches result — re-visiting same movie doesn't re-fetch
- [ ] Abort controller used to cancel in-flight fetch when new search fires
- [ ] Search query preserved in URL params (`?q=batman`) — back button restores it
- [ ] Genre rendered as styled badge tags on detail page

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── MovieCard/
│   ├── MovieGrid/
│   ├── SearchBar/
│   ├── BookmarkButton/
│   └── EmptyState/
├── pages/
│   ├── HomePage.jsx
│   ├── MovieDetailPage.jsx
│   └── BookmarksPage.jsx
├── context/
│   └── BookmarkContext.jsx
├── hooks/
│   └── useDebounce.js
├── data/
│   └── movies.js          ← only if using mock data
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT call the API on every keystroke — debounce is mandatory
❌ Do NOT store bookmarks only in a single page's useState
❌ Do NOT use index as key
❌ Do NOT crash when Poster is "N/A" — always have a fallback
❌ Do NOT skip loading/error states on the detail page fetch
❌ Do NOT hardcode the imdbID in the detail page — read it from useParams
```

## Quick Start

```bash
npm create vite@latest movie-search-app -- --template react
cd movie-search-app
npm install react-router-dom
npm run dev
```

---

> **Reminder:** Read all requirements before starting.  
> Plan your routes and BookmarkContext shape on paper first.  
> The evaluator is checking that bookmarks work across all three pages — not just one.
