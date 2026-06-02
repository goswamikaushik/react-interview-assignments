# ✅ React Interview Assignment — Project 02
## Todo App Pro

> **Time Limit:** 75 minutes  
> **Difficulty:** Medium  
> **Mock API:** None — all data is local state + localStorage  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Data Shape](#data-shape)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [Sorting Logic](#sorting-logic)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A fully functional task manager. Not a basic counter with checkboxes.  
This one tests state management depth, derived data, and persistence.

Users can:
- Add new tasks
- Mark tasks complete / incomplete
- Edit a task's text inline
- Delete tasks
- Filter tasks (All / Active / Completed)
- See tasks sorted correctly (active by newest first, completed by oldest-completed first)
- Have all tasks survive a page refresh

No API calls. No backend. No auth. Pure frontend state + localStorage.

---

## Data Shape

Every task is an object with this exact shape:

```js
{
  id: "uuid-string",           // unique ID — use crypto.randomUUID() or Date.now().toString()
  text: "Buy groceries",       // the task text
  completed: false,            // toggle state
  createdAt: "2024-01-15T10:30:00.000Z",    // ISO string — set when task is created
  completedAt: null            // ISO string — set when task is marked complete, null otherwise
}
```

> `completedAt` must be set to `new Date().toISOString()` at the moment the user checks the task.  
> `completedAt` must be reset to `null` when the user unchecks a completed task.

---

## Feature Requirements

### F1 — Add Task

- Text input + "Add" button at the top
- Pressing `Enter` in the input also adds the task
- Trim whitespace before adding — `"   "` is not a valid task
- Empty input after trimming → show inline error: `"Task cannot be empty"`
- After successful add → clear the input field
- New task is always added to the top of the active list
- New task starts with `completed: false` and `completedAt: null`

---

### F2 — Task Item Display

Each task item must show:
- Checkbox (clicking toggles `completed`)
- Task text
- Edit button (pencil icon or "Edit" label)
- Delete button (X icon or "Delete" label)
- Completed tasks must have:
  - Strikethrough text style
  - Visually dimmed appearance (opacity or color change)
  - Checkbox checked

---

### F3 — Inline Edit

- Clicking "Edit" on a task replaces the task text with an input field
- Input is pre-filled with current task text
- "Save" button confirms the edit
- "Cancel" button discards changes
- Pressing `Enter` also saves
- Pressing `Escape` also cancels
- Empty text after trim → show inline error, do not save
- Only ONE task can be in edit mode at a time
  - Opening edit on task B while task A is in edit → cancel A's edit automatically

---

### F4 — Delete Task

- Clicking delete removes the task immediately
- No confirmation dialog required
- After deletion, focus should not break (no page jump)

---

### F5 — Filter Tabs

Three tabs always visible:

| Tab | Shows |
|---|---|
| **All** | Every task regardless of status |
| **Active** | Only `completed: false` tasks |
| **Completed** | Only `completed: true` tasks |

- Active tab is visually highlighted
- Tab counts update live:
  - `All (5)` / `Active (3)` / `Completed (2)`
- These counts are **derived** — do NOT store them in state

---

### F6 — Sorting

Active tasks (completed: false):
- Sort by `createdAt` **descending** (newest first)

Completed tasks (completed: true):
- Sort by `completedAt` **ascending** (oldest-completed first — the ones you finished earliest show at top)

When showing "All":
- Active tasks at the top (sorted by createdAt desc)
- Completed tasks below (sorted by completedAt asc)

> All sorting is **derived**. Do NOT store sorted arrays in state.

---

### F7 — Empty States

Do not show a blank screen when a list is empty.

| Situation | Message to show |
|---|---|
| No tasks at all | `"Nothing to do. Add your first task above."` |
| Active filter, no active tasks | `"You're all caught up! 🎉"` |
| Completed filter, no completed tasks | `"No completed tasks yet."` |

---

### F8 — Bulk Actions

At the bottom of the task list, show:

- **"Clear Completed"** button — removes ALL completed tasks at once
  - Only visible when there is at least one completed task
- **"Mark All Complete"** button — marks every task as complete
  - Only visible when there is at least one active task
  - When marking all complete, set `completedAt` for each one

---

### F9 — localStorage Persistence

- All tasks must persist across page refreshes
- Key name: `"todos"`
- Restore on mount, save on every change

---

## Constraints

```
1. No external UI library (no MUI, no Chakra, no Ant Design)
   Write your own CSS.

2. No external state library (no Redux, no Zustand)
   useState or useReducer only.

3. Sorted lists and filter counts are DERIVED STATE
   Compute them directly during render.
   Do NOT store sortedTasks or filteredTasks in useState.

4. useReducer is strongly preferred for task operations
   add / toggle / edit / delete / markAllComplete / clearCompleted
   — these are all state transitions. useReducer is the right tool.

5. completedAt must be set and cleared correctly
   Set to ISO string when task is checked.
   Reset to null when task is unchecked.
   Evaluator will inspect this in React DevTools.

6. Only one task in edit mode at a time
   Opening edit on task B must cancel any in-progress edit on task A.

7. No index as key
   Use the task's id field as the key.
```

---

## Component Architecture

```
App
├── Header
│     └── App title
│
├── AddTaskForm
│     ├── input (controlled)
│     └── Add button
│
├── FilterTabs
│     └── Tab × 3  (All / Active / Completed) with counts
│
├── TaskList
│     └── TaskItem  (× N)
│           ├── Checkbox
│           ├── TaskText  (display mode)
│           │     OR
│           ├── EditForm  (edit mode — inline)
│           │     ├── input (pre-filled)
│           │     ├── Save button
│           │     └── Cancel button
│           ├── EditButton
│           └── DeleteButton
│
└── BulkActions
      ├── Mark All Complete button
      └── Clear Completed button
```

**State shape (single reducer):**

```js
{
  tasks: [
    {
      id: string,
      text: string,
      completed: boolean,
      createdAt: string,   // ISO
      completedAt: string | null
    }
  ],
  filter: "all" | "active" | "completed",
  editingId: string | null    // which task is currently in edit mode
}
```

**Reducer actions to implement:**

```js
{ type: "ADD_TASK",          payload: { text } }
{ type: "TOGGLE_TASK",       payload: { id } }
{ type: "DELETE_TASK",       payload: { id } }
{ type: "START_EDIT",        payload: { id } }
{ type: "SAVE_EDIT",         payload: { id, text } }
{ type: "CANCEL_EDIT" }
{ type: "SET_FILTER",        payload: { filter } }
{ type: "MARK_ALL_COMPLETE" }
{ type: "CLEAR_COMPLETED" }
{ type: "LOAD_FROM_STORAGE", payload: { tasks } }
```

---

## Sorting Logic

```js
// Derive filtered + sorted tasks — run this during render
function getVisibleTasks(tasks, filter) {
  const active    = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))  // newest first

  const completed = tasks
    .filter(t => t.completed)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))  // oldest-completed first

  if (filter === "active")    return active
  if (filter === "completed") return completed
  return [...active, ...completed]   // All: active on top, completed below
}
```

Call this function inside your component render. Do not store the result in state.

---

## localStorage Rules

```js
// Save — in useEffect watching tasks
useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(tasks))
}, [tasks])

// Load — in useReducer init or useEffect on mount
try {
  const saved = localStorage.getItem("todos")
  if (saved) {
    const parsed = JSON.parse(saved)
    // Validate it's an array before using
    if (Array.isArray(parsed)) dispatch({ type: "LOAD_FROM_STORAGE", payload: { tasks: parsed } })
  }
} catch {
  // Corrupt data → start with empty tasks
}
```

---

## What the Evaluator Checks

### ✅ Must Pass (Non-negotiable)

- [ ] Can add a new task
- [ ] Empty task is rejected with an error message
- [ ] Enter key adds task
- [ ] Task can be marked complete / incomplete via checkbox
- [ ] Completed tasks have strikethrough style
- [ ] Task can be deleted
- [ ] Edit opens inline with pre-filled text
- [ ] Edited text saves correctly
- [ ] Cancel edit restores original text
- [ ] Escape key cancels edit
- [ ] Only one task in edit mode at a time
- [ ] All / Active / Completed filter tabs work
- [ ] Tab counts are correct and live
- [ ] Active tasks sorted newest first
- [ ] Completed tasks sorted oldest-completed first
- [ ] "All" tab shows active on top, completed below
- [ ] Empty state messages shown correctly
- [ ] "Clear Completed" removes all completed tasks
- [ ] "Mark All Complete" marks everything done and sets `completedAt`
- [ ] Tasks persist after page refresh
- [ ] No console errors in normal usage

### ⭐ Senior-Level Bonus

- [ ] `useReducer` used instead of multiple `useState` calls
- [ ] `completedAt` is set at toggle time and cleared on untoggle (check in DevTools)
- [ ] `React.memo` on `TaskItem` to prevent re-render of all items when one changes
- [ ] `useCallback` on action dispatchers passed as props
- [ ] `editingId` tracked in reducer state (not a separate `useState`)
- [ ] Keyboard accessibility — Tab, Enter, Escape all work naturally
- [ ] `localStorage` load validates that data is an array before using it
- [ ] Bulk action buttons conditionally hidden (not just disabled) when irrelevant

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   │   └── Header.jsx
│   ├── AddTaskForm/
│   │   ├── AddTaskForm.jsx
│   │   └── AddTaskForm.css
│   ├── FilterTabs/
│   │   ├── FilterTabs.jsx
│   │   └── FilterTabs.css
│   ├── TaskList/
│   │   └── TaskList.jsx
│   ├── TaskItem/
│   │   ├── TaskItem.jsx
│   │   └── TaskItem.css
│   └── BulkActions/
│       └── BulkActions.jsx
│
├── reducer/
│   └── todoReducer.js        ← all state transitions here
│
├── utils/
│   └── sortTasks.js          ← getVisibleTasks function
│
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT store filteredTasks or sortedTasks in useState
❌ Do NOT use index as key on TaskItem
❌ Do NOT allow two tasks to be in edit mode simultaneously
❌ Do NOT forget to reset completedAt to null when a task is unchecked
❌ Do NOT store tab counts in state — derive them from tasks array
❌ Do NOT show blank UI for empty states — always show a message
❌ Do NOT put task logic (add, toggle, delete) directly in components
   — it belongs in the reducer
❌ Do NOT use an external drag-and-drop library — not required here
```

---

## Quick Start

```bash
npm create vite@latest todo-app-pro -- --template react
cd todo-app-pro
npm install
npm run dev
```

No additional dependencies required.

---

> **Reminder:** Plan your reducer actions and state shape before writing JSX.  
> The evaluator cares more about **how you manage state** than how it looks.  
> A clean reducer + correct derived data beats a pretty UI with messy state every time.
