# 📋 React Interview Assignment — Project 09
## Kanban Task Board (Trello-lite)

> **Time Limit:** 90 minutes  
> **Difficulty:** Hard  
> **Mock API:** None — local state + localStorage  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Data Shape](#data-shape)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [State Shape & Reducer](#state-shape--reducer)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A Kanban board for task tracking. Users can:
- See tasks organized in 3 columns: **Todo**, **In Progress**, **Done**
- Add new tasks to any column
- Edit task details
- Move tasks between columns using buttons (no drag-and-drop required)
- Delete tasks
- Filter tasks by priority or assignee
- See live column counts
- All data persists across refresh

No API calls. No drag-and-drop library. Complex nested state management.

---

## Data Shape

**Column (fixed — do NOT make columns dynamic):**
```js
const COLUMNS = [
  { id: "todo",        title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done",        title: "Done" }
]
```

**Task object:**
```js
{
  id: "task-uuid",
  title: "Design login page",                    // required
  description: "Figma mockup + component tree",  // optional
  priority: "high",                              // "low" | "medium" | "high"
  assignee: "Kaushik",                           // from MEMBERS list
  columnId: "todo",                              // "todo" | "in-progress" | "done"
  createdAt: "2024-01-15T10:00:00.000Z",
  tags: ["design", "frontend"]                   // array of strings, optional
}
```

**Fixed members:**
```js
const MEMBERS = ["Kaushik", "Raj", "Priya", "Ankit", "Unassigned"]
```

**Priority colors:**
```js
const PRIORITY_COLORS = {
  low:    "#22c55e",   // green
  medium: "#f59e0b",   // amber
  high:   "#ef4444"    // red
}
```

---

## Feature Requirements

### F1 — Board Layout

- Three columns side by side: Todo | In Progress | Done
- Each column shows:
  - Column title
  - Task count badge: `Todo (4)`
  - "Add Task" button at the bottom of the column
  - All tasks in that column as `TaskCard` components

---

### F2 — TaskCard

Each card shows:
- Title
- Priority badge (colored dot + label)
- Assignee name + avatar (DiceBear: `https://api.dicebear.com/7.x/initials/svg?seed=NAME`)
- Tags (if any) as small chips
- Description preview (1 line, truncated)
- Move buttons:
  - "←" button moves task to previous column (hidden if in first column)
  - "→" button moves task to next column (hidden if in last column)
- Edit button
- Delete button

---

### F3 — Add Task (per column)

Clicking "Add Task" in a column opens an inline form (or modal) for that column:

Fields:
- **Title** — text input, required
- **Description** — textarea, optional
- **Priority** — select: Low / Medium / High (default: Medium)
- **Assignee** — select from MEMBERS list (default: Unassigned)
- **Tags** — comma-separated input (parse on submit, trim each tag)

On submit:
- Create task with `columnId` = the column it was added to
- `createdAt` = current ISO timestamp
- Close the form

On cancel → close without saving

---

### F4 — Edit Task

- Opens same form as Add, pre-filled with current values
- Can change any field including priority, assignee, tags
- Saving updates task in-place (column does NOT change on edit)
- Cancel discards changes

---

### F5 — Move Task

- "→" button: move task to next column
- "←" button: move task to previous column
- Column order: Todo → In Progress → Done
- Update `task.columnId` accordingly
- Button hidden (not just disabled) at the ends

---

### F6 — Delete Task

- Delete button on each card
- `window.confirm("Delete this task?")` — simple confirmation
- Remove from board immediately

---

### F7 — Filters (Board-wide)

Filters sit above the board and affect ALL columns simultaneously.

- **Filter by Priority** — select: All / Low / Medium / High
- **Filter by Assignee** — select: All / each member

When filters are active:
- Cards not matching are hidden
- Column counts update to reflect only visible cards: `Todo (2/4)` — "2 visible of 4 total"
- Filters are **derived** — do not store filtered tasks in state

---

### F8 — Board Summary (top of page)

Show 4 stat cards:
- **Total Tasks** — all tasks
- **Todo** — count in todo column
- **In Progress** — count in in-progress column
- **Done** — count in done column

These are **derived** — do not store in state.

---

### F9 — Empty Column State

When a column has no tasks (or no visible tasks after filter):
- Show a placeholder: `"No tasks here"` or `"No tasks match filters"`

---

## Constraints

```
1. No drag-and-drop library — use ← → buttons
2. No external state library — useReducer required (this is nested state)
3. No external UI library
4. Filtered tasks are DERIVED — do NOT store filteredTasks in state
5. Column counts are DERIVED — do NOT store them in state
6. COLUMNS are fixed — users cannot add or delete columns
7. Tags parsed from comma-separated string into array on submit
8. No index as key — use task.id
```

---

## Component Architecture

```
App
├── Header
│     └── Board title
│
├── BoardSummary  (4 stat cards)
│
├── FilterBar
│     ├── PriorityFilter  (select)
│     └── AssigneeFilter  (select)
│
└── Board
      └── Column  (× 3: todo, in-progress, done)
            ├── ColumnHeader  (title + count badge)
            ├── TaskList
            │     └── TaskCard  (× N)
            │           ├── MoveButtons (← →)
            │           ├── EditButton
            │           └── DeleteButton
            └── AddTaskButton
                  └── TaskForm  (inline or modal, shown on click)
```

**Only ONE form open at a time** — adding a task in column A while a form is open in column B should close column B's form.

---

## State Shape & Reducer

```js
// State shape
{
  tasks: [
    { id, title, description, priority, assignee, columnId, createdAt, tags }
  ],
  activeFormColumnId: null,   // which column's "Add Task" form is open
  editingTaskId: null,        // which task is being edited
  filterPriority: "all",
  filterAssignee: "all"
}

// Reducer actions
{ type: "ADD_TASK",           payload: taskData }
{ type: "UPDATE_TASK",        payload: { id, updates } }
{ type: "DELETE_TASK",        payload: { id } }
{ type: "MOVE_TASK",          payload: { id, direction } }   // "next" | "prev"
{ type: "OPEN_ADD_FORM",      payload: { columnId } }
{ type: "CLOSE_FORM" }
{ type: "START_EDIT",         payload: { id } }
{ type: "CANCEL_EDIT" }
{ type: "SET_FILTER_PRIORITY", payload: { priority } }
{ type: "SET_FILTER_ASSIGNEE", payload: { assignee } }
{ type: "LOAD_FROM_STORAGE",  payload: { tasks } }
```

**Move task logic in reducer:**
```js
case "MOVE_TASK": {
  const COLUMN_ORDER = ["todo", "in-progress", "done"]
  const task = state.tasks.find(t => t.id === action.payload.id)
  const currentIndex = COLUMN_ORDER.indexOf(task.columnId)
  const newIndex = action.payload.direction === "next"
    ? currentIndex + 1
    : currentIndex - 1
  if (newIndex < 0 || newIndex >= COLUMN_ORDER.length) return state
  return {
    ...state,
    tasks: state.tasks.map(t =>
      t.id === action.payload.id
        ? { ...t, columnId: COLUMN_ORDER[newIndex] }
        : t
    )
  }
}
```

---

## localStorage Rules

```js
// Key: "kanban-tasks"
// Save on tasks change only
useEffect(() => {
  localStorage.setItem("kanban-tasks", JSON.stringify(tasks))
}, [tasks])

// Load on mount
const initTasks = () => {
  try {
    const saved = localStorage.getItem("kanban-tasks")
    return saved && Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : getDefaultTasks()
  } catch { return getDefaultTasks() }
}
```

**Provide 3–4 default tasks** so the board isn't empty on first load:
```js
function getDefaultTasks() {
  return [
    { id: "default-1", title: "Set up project structure", description: "Create folders, install deps", priority: "high",   assignee: "Kaushik", columnId: "done",        createdAt: new Date().toISOString(), tags: ["setup"] },
    { id: "default-2", title: "Design component tree",    description: "Plan all components",          priority: "medium", assignee: "Raj",     columnId: "done",        createdAt: new Date().toISOString(), tags: ["design"] },
    { id: "default-3", title: "Build Kanban board",       description: "All columns and cards",        priority: "high",   assignee: "Kaushik", columnId: "in-progress", createdAt: new Date().toISOString(), tags: ["frontend"] },
    { id: "default-4", title: "Add localStorage support", description: "Persist on every change",      priority: "medium", assignee: "Priya",   columnId: "todo",        createdAt: new Date().toISOString(), tags: ["storage"] },
    { id: "default-5", title: "Write README",             description: "Document the project",         priority: "low",    assignee: "Ankit",   columnId: "todo",        createdAt: new Date().toISOString(), tags: ["docs"] },
  ]
}
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] Board shows 3 columns with correct titles
- [ ] Default tasks appear on first load
- [ ] Column counts are correct
- [ ] Can add a task to any column
- [ ] Form has all required fields (title, priority, assignee, tags)
- [ ] Can edit a task (form pre-fills correctly)
- [ ] Can delete a task with confirmation
- [ ] "→" moves task to next column
- [ ] "←" moves task to previous column
- [ ] Move buttons hidden at column boundaries
- [ ] Priority filter filters all columns simultaneously
- [ ] Assignee filter works
- [ ] Column counts update when filters are active
- [ ] Board summary stats are correct
- [ ] Empty column state shown
- [ ] Data persists after refresh
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `useReducer` for all board state
- [ ] Only one form open at a time (opening new form closes previous)
- [ ] `React.memo` on `TaskCard`
- [ ] `useCallback` on action dispatchers passed to Column/TaskCard
- [ ] Tags rendered as styled chips
- [ ] DiceBear avatar on each TaskCard for assignee
- [ ] Column count shows `"visible/total"` format when filters are active

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── BoardSummary/
│   ├── FilterBar/
│   ├── Board/
│   │   ├── Board.jsx
│   │   ├── Column.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskForm.jsx
│   └── EmptyColumn/
├── reducer/
│   └── boardReducer.js
├── constants/
│   └── index.js   ← COLUMNS, MEMBERS, PRIORITY_COLORS
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT use a drag-and-drop library — use ← → buttons
❌ Do NOT store filtered tasks in state
❌ Do NOT allow multiple forms open at once
❌ Do NOT use index as key on tasks
❌ Do NOT make columns dynamic (no add/delete column feature)
❌ Do NOT skip the default tasks — board must not be empty on first load
```

---

## Quick Start

```bash
npm create vite@latest kanban-board -- --template react
cd kanban-board
npm install
npm run dev
```

---

> **Reminder:** Read all requirements before starting.  
> Plan your reducer actions before writing JSX — this app has the most complex state of the series.  
> The default tasks must be present on first load — an empty board on first open is an immediate deduction.
