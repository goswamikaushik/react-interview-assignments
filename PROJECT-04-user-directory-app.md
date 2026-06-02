# 👤 React Interview Assignment — Project 04
## User Directory App

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
7. [What the Evaluator Checks](#what-the-evaluator-checks)
8. [Folder Structure](#folder-structure)
9. [Do Not Do](#do-not-do)

---

## What You're Building

An employee/user directory app. Users can:
- Browse all users in a paginated list
- Search by name or email
- Filter by company
- Click a user to see their profile detail page
- See that user's posts on their profile page

Two pages. React Router required.

---

## Mock API Reference

**Base URL:** `https://jsonplaceholder.typicode.com`

| Endpoint | Method | Returns |
|---|---|---|
| `/users` | GET | 10 users |
| `/users/:id` | GET | Single user |
| `/users/:id/posts` | GET | Posts by that user |

**User shape:**
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "phone": "1-770-736-0857 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net"
  },
  "address": {
    "city": "Gwenborough",
    "street": "Kulas Light",
    "zipcode": "92998-3874"
  }
}
```

**Post shape:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat...",
  "body": "quia et suscipit\nsuscipit..."
}
```

> The API only has 10 users. Implement pagination client-side with 4 users per page.

---

## Feature Requirements

### F1 — Directory Page (`/`)

- Fetch all users on mount
- Show loading spinner during fetch
- Show error message if fetch fails
- Render users as `UserCard` components in a grid or list

---

### F2 — UserCard

Each card shows:
- Avatar — generate from `https://api.dicebear.com/7.x/initials/svg?seed=NAME`
  - Replace `NAME` with the user's name (URL-encoded)
  - Example: `https://api.dicebear.com/7.x/initials/svg?seed=Leanne%20Graham`
- Full name
- Email
- Company name
- City
- Clicking anywhere on the card navigates to `/user/:id`

---

### F3 — Search

- Input at top of directory page
- Searches in real-time across `name` AND `email` (case-insensitive)
- Resets pagination to page 1 when search changes
- Shows `"No users match your search"` when empty

---

### F4 — Company Filter

- Dropdown (`<select>`) with all unique company names
- First option: `"All Companies"`
- Filters users by selected company
- Search + company filter work together
- Resets pagination to page 1 when filter changes

---

### F5 — Pagination

- 4 users per page (client-side)
- Show: `Previous` / `Next` buttons
- Show current page indicator: `Page 2 of 3`
- `Previous` disabled on page 1
- `Next` disabled on last page
- Pagination recalculates when search or filter is active

---

### F6 — User Profile Page (`/user/:id`)

- Read `id` from URL params
- Fetch user detail: `/users/:id`
- Fetch user's posts: `/users/:id/posts`
- Both fetches happen in parallel (`Promise.all`)
- Show loading state while both are fetching
- Show error if either fails

**Display:**
- Avatar (same DiceBear URL)
- Full name + username
- Email + phone + website
- Company name + catchPhrase
- Full address (street, city, zipcode)
- Posts section below:
  - Each post shows title + body (body truncated to 2 lines)
  - Post count: `"Posts (8)"`
- Back button → `/`

---

### F7 — Navigation Header

- App name
- Link to `/` (Directory)
- Total user count shown: `"10 Users"`

---

## Constraints

```
1. React Router v6 required
2. No external state library
3. Parallel fetch on profile page — use Promise.all
   Two separate sequential fetches is a deduction
4. Pagination is client-side — do NOT fetch per page
   Fetch all 10 users once, slice client-side
5. Search + filter are derived — do NOT store filtered list in state
6. Avatar must use DiceBear URL — no placeholder boxes
7. No index as key — use user id
```

---

## Component Architecture

```
App  (Router)
├── Header
│
├── Route: /
│     └── DirectoryPage
│           ├── SearchBar
│           ├── CompanyFilter  (select dropdown)
│           ├── UserGrid
│           │     └── UserCard  (× N)
│           ├── Pagination
│           └── EmptyState
│
└── Route: /user/:id
      └── ProfilePage
            ├── BackButton
            ├── UserInfo
            │     ├── Avatar
            │     └── Details (name, email, phone, company, address)
            └── PostsList
                  └── PostItem  (× N)
```

**State in DirectoryPage:**
```js
const [users, setUsers]           = useState([])       // all users from API
const [loading, setLoading]       = useState(false)
const [error, setError]           = useState(null)
const [searchQuery, setSearch]    = useState("")
const [selectedCompany, setComp]  = useState("all")
const [currentPage, setPage]      = useState(1)

const USERS_PER_PAGE = 4

// Derived — compute during render
const filteredUsers = users
  .filter(u => selectedCompany === "all" || u.company.name === selectedCompany)
  .filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

const totalPages   = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
const visibleUsers = filteredUsers.slice(
  (currentPage - 1) * USERS_PER_PAGE,
  currentPage * USERS_PER_PAGE
)

const companies = [...new Set(users.map(u => u.company.name))]
```

---

## Pagination Logic

```js
// Reset to page 1 when search or filter changes
useEffect(() => {
  setPage(1)
}, [searchQuery, selectedCompany])

// Slice for current page
const visibleUsers = filteredUsers.slice(
  (currentPage - 1) * USERS_PER_PAGE,
  currentPage * USERS_PER_PAGE
)
```

---

## Parallel Fetch on Profile Page

```js
// ProfilePage — fetch user + posts at the same time
useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const [user, posts] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(r => r.json()),
        fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`).then(r => r.json())
      ])
      setUser(user)
      setPosts(posts)
    } catch {
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [id])
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] Users load from API
- [ ] Loading state shown
- [ ] Error state shown on failure
- [ ] UserCard shows avatar, name, email, company, city
- [ ] Search filters by name AND email
- [ ] Company filter works
- [ ] Search + company filter work together
- [ ] Pagination shows 4 users per page
- [ ] Previous / Next buttons work
- [ ] Previous disabled on page 1, Next disabled on last page
- [ ] Page resets to 1 when search or filter changes
- [ ] Clicking card navigates to `/user/:id`
- [ ] Profile page shows user info
- [ ] Profile page shows posts
- [ ] Both fetches are parallel (Promise.all)
- [ ] Back button works
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `React.memo` on `UserCard`
- [ ] Custom hook `useUser(id)` encapsulating the profile fetch
- [ ] Company filter derived from users data (not hardcoded)
- [ ] `useDebounce` on search input
- [ ] DiceBear avatar URL correctly encoded for names with spaces
- [ ] Post body truncated with CSS (`-webkit-line-clamp`)

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── UserCard/
│   ├── UserGrid/
│   ├── SearchBar/
│   ├── CompanyFilter/
│   ├── Pagination/
│   ├── PostItem/
│   └── EmptyState/
├── pages/
│   ├── DirectoryPage.jsx
│   └── ProfilePage.jsx
├── hooks/
│   └── useUser.js
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT fetch users again when page or filter changes — fetch once, slice client-side
❌ Do NOT store filteredUsers in state
❌ Do NOT make two sequential fetches on profile page — use Promise.all
❌ Do NOT forget to reset page to 1 on search/filter change
❌ Do NOT use index as key
❌ Do NOT use a placeholder box instead of DiceBear avatar
```

---

## Quick Start

```bash
npm create vite@latest user-directory -- --template react
cd user-directory
npm install react-router-dom
npm run dev
```

---

> **Reminder:** Read all requirements before starting.  
> Plan your routes and pagination logic on paper first.  
> The key check: parallel fetch with Promise.all on the profile page — sequential fetches will cost you marks.
