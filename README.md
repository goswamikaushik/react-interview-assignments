# ⚛️ React Interview Assignment Series

## Master Index — 10 Projects

> **Goal:** Cover every concept interviewers test in React coding rounds.  
> **Method:** Build each project from scratch using only the README as your brief.  
> **Rule:** Set a timer. Treat every project like a real interview round.

---

## The 10 Projects

| #   | Project            | Difficulty  | Time    | API             | Key Concepts                                                          |
| --- | ------------------ | ----------- | ------- | --------------- | --------------------------------------------------------------------- |
| 01  | 🛒 Shopping Cart   | Medium–Hard | 90 min  | FakeStore API   | Fetch, Filter, Search, Cart, Promo, localStorage, Context             |
| 02  | ✅ Todo App Pro    | Medium      | 75 min  | None            | useReducer, Derived state, Sorting, Inline edit, localStorage         |
| 03  | 🎬 Movie Search    | Medium–Hard | 90 min  | OMDB / Mock     | Debounce, Router, Bookmarks, localStorage, Custom hook                |
| 04  | 👤 User Directory  | Medium      | 75 min  | JSONPlaceholder | Fetch, Pagination, Filter, Router, Promise.all                        |
| 05  | 💸 Expense Tracker | Hard        | 90 min  | None            | Complex forms, Validation, Balance calc, useReducer, useMemo          |
| 06  | 📰 News Feed       | Medium      | 75 min  | JSONPlaceholder | Debounce, Category tabs, Pagination, Read Later, Router               |
| 07  | 🧾 Invoice App     | Hard        | 90 min  | None            | Dynamic forms, Line items, Derived totals, Status machine, View state |
| 08  | 🍕 Food Delivery   | Hard        | 105 min | Mock JSON       | Multi-level data, Cart conflict, Promo, Router, Context               |
| 09  | 📋 Kanban Board    | Hard        | 90 min  | None            | Nested state, useReducer, Move logic, Filters, localStorage           |
| 10  | 🧑‍💼 Job Board       | Medium–Hard | 90 min  | Mock JSON       | Multi-page, Apply flow, Forms, Saved state, Global Context            |

---

## Concept Coverage Map

| Concept                               | Projects That Cover It             |
| ------------------------------------- | ---------------------------------- |
| **API Fetch + Loading/Error states**  | 01, 03, 04, 06                     |
| **Client-side Search (debounced)**    | 01, 03, 04, 06, 10                 |
| **Client-side Filter**                | 01, 03, 04, 05, 06, 08, 09, 10     |
| **Client-side Pagination**            | 04, 06, 10                         |
| **Cart / Transactional logic**        | 01, 08                             |
| **Promo Code logic**                  | 01, 08                             |
| **Forms + Validation**                | 05, 07, 10                         |
| **Dynamic form (add/remove rows)**    | 07                                 |
| **useReducer**                        | 02, 05, 07, 08, 09                 |
| **Derived state (never stored)**      | 01, 02, 04, 05, 06, 07, 09, 10     |
| **Context API (global state)**        | 01, 03, 06, 08, 10                 |
| **React Router v6**                   | 03, 04, 06, 08, 10                 |
| **localStorage persistence**          | 01, 02, 03, 05, 06, 07, 08, 09, 10 |
| **Custom hooks**                      | 03, 04, 06, 10                     |
| **Promise.all (parallel fetch)**      | 04, 06                             |
| **Inline edit**                       | 02, 09                             |
| **Status / State machine**            | 07, 10                             |
| **Nested state management**           | 07, 08, 09                         |
| **React.memo / useCallback**          | All (bonus in every project)       |
| **useMemo for expensive derivations** | 05, 06, 09, 10                     |

---

## Recommended Build Order

### Phase 1 — Core Patterns (Build these first)

```
Project 02 → Todo App Pro       (learn useReducer, derived state)
Project 01 → Shopping Cart      (add API, Context, cart logic)
Project 04 → User Directory     (Router, pagination, parallel fetch)
```

### Phase 2 — Advanced Features

```
Project 03 → Movie Search       (debounce, bookmarks, custom hooks)
Project 06 → News Feed          (combine everything from Phase 1)
Project 05 → Expense Tracker    (complex forms, balance logic)
```

### Phase 3 — Interview-Hard Level

```
Project 07 → Invoice App        (dynamic forms, state machine, no Router)
Project 09 → Kanban Board       (deeply nested state, move logic)
Project 08 → Food Delivery      (multi-page, cart conflict, full app)
Project 10 → Job Board          (most complete app, all concepts combined)
```

---

## How to Use This Repo

### Step 1 — Read the README

Open the project's `.md` file. Read it fully. Don't start coding yet.

### Step 2 — Plan on paper (5 minutes)

Draw your component tree. Write your state shape. Identify what's global vs local.

### Step 3 — Set the timer

Stick to the time limit. Real interviews don't wait.

### Step 4 — Build

No looking at solutions. No asking AI to code it for you. Struggle is the learning.

### Step 5 — Self-evaluate

When done, run through the "What the Evaluator Checks" list yourself.  
Count how many ✅ Must Pass items you hit.  
Count how many ⭐ Senior Bonus items you hit.

### Step 6 — Review your weak spots

Note which items you missed. These are your gaps. Study those patterns specifically.

---

## What Interviewers Are Really Watching

They are not watching whether it "works."  
They are watching:

1. **Architecture decisions** — Do you know when to use Context vs local state?
2. **Derived vs stored state** — Do you compute or do you `useState` everything?
3. **Data shape design** — Is your state shape sensible and minimal?
4. **Component boundaries** — Do you break things into the right pieces?
5. **Edge cases** — Loading, error, empty, invalid input — do you handle them?
6. **Code clarity** — Can another developer read your code easily?

A feature-complete app with poor architecture loses to a partially-complete app with excellent architecture.

---

## APIs Used Across Projects

| API                                  | Projects               | Free?  | Signup?  |
| ------------------------------------ | ---------------------- | ------ | -------- |
| https://fakestoreapi.com             | 01                     | ✅ Yes | ❌ No    |
| https://jsonplaceholder.typicode.com | 04, 06                 | ✅ Yes | ❌ No    |
| https://www.omdbapi.com              | 03 (optional)          | ✅ Yes | ✅ Email |
| https://api.dicebear.com             | 04, 09                 | ✅ Yes | ❌ No    |
| Mock JSON (local files)              | 03, 05, 07, 08, 09, 10 | ✅ Yes | ❌ No    |

---

_Total practice time if you build all 10: ~14.5 hours of focused interview-level React work._  
_Build one per day for 10 days. You will be interview-ready._

---

## Author

**Kaushik Goswami** — Software Developer  
🌐 [goswamikaushik.dev](https://goswamikaushik.dev/)  
💼 [linkedin.com/in/goswamikaushik](https://www.linkedin.com/in/goswamikaushik/)

---

_These assignment briefs were crafted with the help of [Claude AI](https://claude.ai) by Anthropic._
