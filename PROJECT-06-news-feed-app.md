# 📰 React Interview Assignment — Project 06
## News / Blog Feed App

> **Time Limit:** 75 minutes  
> **Difficulty:** Medium  
> **Mock API:** https://jsonplaceholder.typicode.com  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Mock API Reference](#mock-api-reference)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [Pagination Logic](#pagination-logic)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A news/blog feed reader. Users can:
- Browse posts fetched from an API
- Filter by category (mocked from userId ranges)
- Search posts by title
- Click a post to read the full article
- Save posts to "Read Later"
- See comments on the article page
- Read Later list persists across refresh

Two pages. React Router required.

---

## Mock API Reference

**Base URL:** `https://jsonplaceholder.typicode.com`

| Endpoint | Method | Returns |
|---|---|---|
| `/posts` | GET | 100 posts |
| `/posts/:id` | GET | Single post |
| `/posts/:id/comments` | GET | Comments for a post |
| `/users/:id` | GET | Author info |

**Post shape:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat...",
  "body": "quia et suscipit\nsuscipit recusandae..."
}
```

**Comment shape:**
```json
{
  "postId": 1,
  "id": 1,
  "name": "id labore ex et quam laborum",
  "email": "Eliseo@gardner.biz",
  "body": "laudantium enim quasi..."
}
```

> The API has no real categories. Map `userId` to a category:
```js
const CATEGORY_MAP = {
  1: "Technology",
  2: "Technology",
  3: "Science",
  4: "Science",
  5: "Business",
  6: "Business",
  7: "Health",
  8: "Health",
  9: "Sports",
  10: "Sports"
}
```

---

## Feature Requirements

### F1 — Feed Page (`/`)

- Fetch all 100 posts on mount (fetch once, paginate client-side)
- Show loading spinner during fetch
- Show error state if fetch fails
- Render posts as `PostCard` components

---

### F2 — PostCard

Each card shows:
- Category badge (derived from `CATEGORY_MAP[post.userId]`)
- Title (truncate to 2 lines)
- Body preview (truncate to 3 lines)
- Author name — fetch from `/users/:userId` for each unique userId
  - There are 10 users total. Fetch all 10 users once, not per-card.
  - Map: `post.userId → user.name`
- "Read Later" button — bookmark icon (filled if saved)
- Clicking card navigates to `/post/:id`

---

### F3 — Search

- Input at top of feed
- Searches post titles in real-time (case-insensitive)
- Debounced 300ms
- Resets to page 1 on search change
- Works alongside active category filter

---

### F4 — Category Filter

- Tabs: `All | Technology | Science | Business | Health | Sports`
- Active tab highlighted
- Filters posts by category (via CATEGORY_MAP)
- Works alongside search
- Resets to page 1 on filter change

---

### F5 — Pagination

- 10 posts per page
- Previous / Next buttons
- `Page X of Y` indicator
- Previous disabled on page 1, Next disabled on last page
- Page resets to 1 when search or category changes

---

### F6 — Article Page (`/post/:id`)

- Read `id` from URL params
- Fetch post detail: `/posts/:id`
- Fetch comments: `/posts/:id/comments`
- Both in parallel (`Promise.all`)
- Show loading state
- Show error state

**Display:**
- Category badge
- Title
- Author name (from pre-fetched users list or fetch `/users/:userId`)
- Full body text
- "Read Later" toggle button
- Comments section:
  - Count: `"Comments (5)"`
  - Each comment: name + email + body
- Back button → `/`

---

### F7 — Read Later Page (`/read-later`)

- Shows all saved posts
- Empty state: `"Nothing saved yet. Browse the feed and save posts to read later."`
- Each saved post card has:
  - Same info as PostCard
  - Remove from Read Later button
- Clicking card navigates to article page

---

### F8 — Navigation

- App name
- Link to `/` (Feed)
- Link to `/read-later` with count badge: `Read Later (3)`

---

## Constraints

```
1. React Router v6 required
2. No external state library
3. Search must be debounced — 300ms
4. Fetch all 100 posts ONCE — do NOT re-fetch on filter/page change
5. Fetch all 10 users ONCE — map userId → name client-side
6. Article page: parallel fetch with Promise.all
7. Read Later state must be global (accessible on all pages)
8. No index as key — use post id
```

---

## Component Architecture

```
App  (Router + ReadLaterContext)
├── Header  (with Read Later count)
│
├── Route: /
│     └── FeedPage
│           ├── SearchBar  (debounced)
│           ├── CategoryTabs
│           ├── PostGrid
│           │     └── PostCard  (× N)
│           └── Pagination
│
├── Route: /post/:id
│     └── ArticlePage
│           ├── BackButton
│           ├── PostContent
│           ├── ReadLaterButton
│           └── CommentsList
│                 └── CommentItem  (× N)
│
└── Route: /read-later
      └── ReadLaterPage
            ├── PostGrid
            │     └── PostCard  (× N)
            └── EmptyState
```

**Global state (ReadLaterContext):**
```js
{
  savedPosts: [],           // array of full post objects
  savePost(post),
  removePost(postId),
  isSaved(postId)
}
```

---

## Pagination Logic

```js
const POSTS_PER_PAGE = 10

// Derived during render
const filteredPosts = posts
  .filter(p => activeCategory === "all" || CATEGORY_MAP[p.userId] === activeCategory)
  .filter(p => p.title.toLowerCase().includes(debouncedSearch.toLowerCase()))

const totalPages   = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
const visiblePosts = filteredPosts.slice(
  (currentPage - 1) * POSTS_PER_PAGE,
  currentPage * POSTS_PER_PAGE
)

// Reset page when filters change
useEffect(() => { setPage(1) }, [debouncedSearch, activeCategory])
```

---

## localStorage Rules

```js
// Key: "readLater"
useEffect(() => {
  localStorage.setItem("readLater", JSON.stringify(savedPosts))
}, [savedPosts])

const init = () => {
  try {
    const saved = localStorage.getItem("readLater")
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}
const [savedPosts, setSavedPosts] = useState(init)
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] 100 posts load from API
- [ ] Loading and error states shown
- [ ] PostCard shows category, title, body preview, author
- [ ] Search filters by title with debounce
- [ ] Category tabs filter correctly
- [ ] Search + category work together
- [ ] Pagination works (10 per page)
- [ ] Page resets on filter/search change
- [ ] Clicking card navigates to article
- [ ] Article page loads post + comments in parallel
- [ ] Comments listed with count
- [ ] Read Later toggle works on feed and article
- [ ] Read Later page shows saved posts
- [ ] Count badge in header is correct
- [ ] Read Later persists after refresh
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `useDebounce` custom hook
- [ ] Users fetched once and memoized — no repeated `/users/:id` calls
- [ ] `React.memo` on `PostCard`
- [ ] `useMemo` for filteredPosts (avoids recompute on unrelated renders)
- [ ] Abort controller cancels in-flight fetch on route change

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── PostCard/
│   ├── PostGrid/
│   ├── SearchBar/
│   ├── CategoryTabs/
│   ├── Pagination/
│   ├── CommentItem/
│   └── EmptyState/
├── pages/
│   ├── FeedPage.jsx
│   ├── ArticlePage.jsx
│   └── ReadLaterPage.jsx
├── context/
│   └── ReadLaterContext.jsx
├── hooks/
│   ├── useDebounce.js
│   └── usePosts.js
├── utils/
│   └── categoryMap.js
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT re-fetch posts on every filter or page change
❌ Do NOT fetch user info per card — fetch all 10 users once
❌ Do NOT forget debounce on search
❌ Do NOT make sequential fetches on article page — use Promise.all
❌ Do NOT store filtered/sorted posts in state
❌ Do NOT forget to reset page to 1 on filter changes
```

---

## Quick Start

```bash
npm create vite@latest news-feed-app -- --template react
cd news-feed-app
npm install react-router-dom
npm run dev
```

---

> **Reminder:** Read all requirements before starting.  
> Fetch all 100 posts and all 10 users once each — never re-fetch on filter or page change.  
> Read Later state must be accessible on all three pages — use Context.
