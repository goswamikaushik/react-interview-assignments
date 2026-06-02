# 💸 React Interview Assignment — Project 05
## Expense Tracker (Splitwise-lite)

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
6. [Calculation Logic](#calculation-logic)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A personal expense tracking app with split-expense logic. Users can:
- Add expenses with amount, category, description, date, and who paid
- See all expenses in a list with filter and sort
- See a summary dashboard (total spent, per-category breakdown, per-person balance)
- Delete expenses
- Have all data persist across refresh

No API calls. No backend. Complex state + derived calculations.

---

## Data Shape

**Expense object:**
```js
{
  id: "uuid-string",
  description: "Dinner at restaurant",
  amount: 1200.00,
  category: "Food",             // one of the categories below
  paidBy: "Kaushik",            // name of person who paid
  splitBetween: ["Kaushik", "Raj", "Priya"],  // people sharing this expense
  date: "2024-01-15",           // YYYY-MM-DD string
  createdAt: "2024-01-15T19:30:00.000Z"
}
```

**Fixed categories:**
```js
const CATEGORIES = ["Food", "Travel", "Utilities", "Entertainment", "Shopping", "Health", "Other"]
```

**Fixed people (group members):**
```js
const MEMBERS = ["Kaushik", "Raj", "Priya", "Ankit"]
```

> These are hardcoded. Users cannot add/remove members in this version.

---

## Feature Requirements

### F1 — Add Expense Form

Fields:
- **Description** — text input, required
- **Amount** — number input, required, must be > 0
- **Category** — dropdown (CATEGORIES list)
- **Date** — date input, required, defaults to today
- **Paid By** — dropdown (MEMBERS list)
- **Split Between** — multi-select checkboxes (MEMBERS list)
  - At least 1 person must be selected
  - `paidBy` person is auto-checked and cannot be unchecked
- **Submit** button: "Add Expense"

**Validation:**
- Description: required, min 3 characters
- Amount: required, must be a positive number
- Date: required
- Split Between: at least 1 person selected

Show inline error messages per field. Do NOT submit if any field is invalid.  
On successful add → reset form to defaults.

---

### F2 — Expense List

- Show all expenses sorted by date (newest first) by default
- Each expense row shows:
  - Date (formatted: `15 Jan 2024`)
  - Description
  - Category badge
  - Amount (formatted: `₹1,200.00`)
  - Paid by name
  - Split between (show as comma-separated names)
  - Per-person share: `₹400.00 each`
  - Delete button

---

### F3 — Filter & Sort

**Filters:**
- By category (dropdown — "All Categories" + each category)
- By person (dropdown — "All Members" + each member — filters by paidBy OR splitBetween)
- By date range (from date + to date inputs — both optional)

**Sort:**
- By date (newest / oldest)
- By amount (highest / lowest)

All filters + sort are **derived** — do not store in state.

---

### F4 — Summary Dashboard

Always visible (top of page or sidebar). Updates live as expenses change.

**Show:**

1. **Total Expenses** — sum of all expense amounts
2. **This Month** — sum of expenses in current calendar month
3. **Per Category Breakdown:**
   - Category name
   - Total amount for that category
   - Percentage of total (e.g. `Food: ₹3,400 (42%)`)
4. **Balance Sheet** (the hard part):
   - For each member, show how much they owe or are owed
   - Net balance = (amount paid by them) − (their share of all expenses they're in)
   - Positive = they are **owed** money
   - Negative = they **owe** money
   - Show: `Kaushik is owed ₹800` or `Raj owes ₹400`

---

### F5 — Delete Expense

- Delete button on each expense row
- Removes immediately
- No confirmation required

---

### F6 — Empty State

When no expenses exist:
- Show: `"No expenses yet. Add your first expense above."`
- When filters are active with no results:
- Show: `"No expenses match your filters."`

---

## Constraints

```
1. No external UI library
2. No external state library — useReducer recommended
3. ALL summary values are DERIVED
   Do NOT store totalExpenses, categoryBreakdown, or balances in state
   Compute them from the expenses array during render or in useMemo
4. Form validation must be per-field with inline error messages
5. paidBy person must always be in splitBetween — enforce this in form logic
6. Amount must be stored as a number, not a string
7. Date stored as YYYY-MM-DD string
8. No index as key — use expense id
```

---

## Component Architecture

```
App
├── Header
│
├── SummaryDashboard
│     ├── TotalCard
│     ├── ThisMonthCard
│     ├── CategoryBreakdown
│     └── BalanceSheet
│
├── AddExpenseForm
│     ├── Controlled inputs (description, amount, date)
│     ├── CategorySelect
│     ├── PaidBySelect
│     └── SplitBetweenCheckboxes
│
├── FilterSortBar
│     ├── CategoryFilter (select)
│     ├── PersonFilter (select)
│     ├── DateRangeFilter (two date inputs)
│     └── SortSelect
│
└── ExpenseList
      └── ExpenseRow  (× N)
            └── DeleteButton
```

**Reducer actions:**
```js
{ type: "ADD_EXPENSE",    payload: expense }
{ type: "DELETE_EXPENSE", payload: { id } }
{ type: "LOAD_FROM_STORAGE", payload: { expenses } }
```

---

## Calculation Logic

```js
// Per-person share of ONE expense
const share = expense.amount / expense.splitBetween.length

// Balance calculation for ALL expenses
function calculateBalances(expenses, members) {
  const balances = {}
  members.forEach(m => balances[m] = 0)

  expenses.forEach(expense => {
    const share = expense.amount / expense.splitBetween.length

    // Person who paid gets credited full amount
    balances[expense.paidBy] += expense.amount

    // Each person in split gets debited their share
    expense.splitBetween.forEach(person => {
      balances[person] -= share
    })
  })

  return balances
  // Positive = owed money (paid more than their share)
  // Negative = owes money (paid less than their share)
}

// Category breakdown
function getCategoryBreakdown(expenses) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const grouped = {}
  expenses.forEach(e => {
    grouped[e.category] = (grouped[e.category] || 0) + e.amount
  })
  return Object.entries(grouped).map(([cat, amt]) => ({
    category: cat,
    amount: amt,
    percentage: total > 0 ? Math.round((amt / total) * 100) : 0
  }))
}
```

---

## localStorage Rules

```js
// Key: "expenses"
// Save on every expenses change
useEffect(() => {
  localStorage.setItem("expenses", JSON.stringify(expenses))
}, [expenses])

// Load on mount
const init = () => {
  try {
    const saved = localStorage.getItem("expenses")
    return saved && Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : []
  } catch { return [] }
}
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] Can add an expense with all fields
- [ ] Form validation works per field with inline errors
- [ ] paidBy person is always in splitBetween
- [ ] Expense appears in list after adding
- [ ] Amount formatted as currency in list
- [ ] Date formatted as `15 Jan 2024`
- [ ] Per-person share shown correctly in each row
- [ ] Can delete an expense
- [ ] Category filter works
- [ ] Person filter works
- [ ] Date range filter works
- [ ] Sort by date and amount works
- [ ] Total expenses in dashboard is correct
- [ ] This month total is correct
- [ ] Category breakdown shows correct amounts + percentages
- [ ] Balance sheet shows correct owed/owes for each person
- [ ] Empty state shown when no expenses
- [ ] Data persists after page refresh
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `useReducer` for expense state
- [ ] `useMemo` for balance and category calculations (expensive derivations)
- [ ] Category breakdown shown as a visual bar (CSS width proportional to percentage)
- [ ] Form resets correctly after submit (all fields back to default)
- [ ] `Math.round` on all currency outputs to avoid floating point display issues
- [ ] Filter + sort combined correctly (filter first, then sort)

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── SummaryDashboard/
│   │   ├── TotalCard.jsx
│   │   ├── CategoryBreakdown.jsx
│   │   └── BalanceSheet.jsx
│   ├── AddExpenseForm/
│   ├── FilterSortBar/
│   ├── ExpenseList/
│   └── ExpenseRow/
├── reducer/
│   └── expenseReducer.js
├── utils/
│   └── calculations.js    ← calculateBalances, getCategoryBreakdown
├── constants/
│   └── index.js           ← CATEGORIES, MEMBERS
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT store derived values (totals, balances) in useState
❌ Do NOT allow paidBy person to be removed from splitBetween
❌ Do NOT store amount as a string
❌ Do NOT skip per-field inline validation
❌ Do NOT forget Math.round on currency calculations
❌ Do NOT use index as key on expense rows
```

---

## Quick Start

```bash
npm create vite@latest expense-tracker -- --template react
cd expense-tracker
npm install
npm run dev
```

---

> **Reminder:** Read all requirements before starting.  
> The balance sheet calculation is the hardest part — plan the math on paper before writing code.  
> The evaluator will check that all summary values are derived, not stored in state.
