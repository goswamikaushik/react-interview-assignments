# 🧾 React Interview Assignment — Project 07
## Invoice / Order Management App

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

An invoice creation and management app. Users can:
- Create invoices with dynamic line items
- Edit draft invoices
- Change invoice status (draft → sent → paid)
- View all invoices with filter by status
- See real-time totals per invoice
- All data persists across refresh

No API calls. No backend. This is 100% about complex form state + derived data.

---

## Data Shape

**Invoice object:**
```js
{
  id: "INV-001",                // auto-generated sequential ID
  clientName: "Acme Corp",
  clientEmail: "billing@acme.com",
  issueDate: "2024-01-15",      // YYYY-MM-DD
  dueDate: "2024-02-15",        // YYYY-MM-DD
  status: "draft",              // "draft" | "sent" | "paid"
  items: [
    {
      id: "item-uuid",
      description: "Web Design",
      quantity: 1,
      unitPrice: 5000.00
    },
    {
      id: "item-uuid",
      description: "Hosting (1 year)",
      quantity: 2,
      unitPrice: 1200.00
    }
  ],
  taxPercent: 18,               // GST/tax percentage (0–100)
  notes: "Payment due in 30 days",
  createdAt: "2024-01-15T10:00:00.000Z"
}
```

**ID format:** Auto-increment — `INV-001`, `INV-002`, `INV-003`, ...  
Store the last invoice number in state and increment on each creation.

---

## Feature Requirements

### F1 — Invoice List Page

- Shows all invoices sorted by `createdAt` descending (newest first)
- Each invoice row shows:
  - Invoice ID (`INV-001`)
  - Client name
  - Issue date (formatted: `15 Jan 2024`)
  - Due date
  - Status badge (color-coded: draft=gray, sent=blue, paid=green)
  - Grand total (formatted: `₹8,360.00`)
  - Action buttons: **Edit** (draft only), **View**, **Delete**
- Status filter tabs: `All | Draft | Sent | Paid` with counts
- Summary at top: total invoiced amount, total paid amount, total outstanding

---

### F2 — Create Invoice Page / Modal

A form to create a new invoice. Fields:

**Client Info:**
- Client Name — required
- Client Email — required, valid email format

**Dates:**
- Issue Date — required, defaults to today
- Due Date — required, must be after Issue Date

**Line Items (dynamic — this is the key part):**
- Start with 1 empty line item
- Each line item has:
  - Description — text input, required
  - Quantity — number, min 1
  - Unit Price — number, min 0
  - Line Total — `quantity × unitPrice` — **read-only, auto-computed**
  - Remove button (disabled when only 1 item remains)
- "Add Line Item" button — adds a new empty row

**Tax:**
- Tax Percent input — number, 0–100, defaults to 18

**Totals (read-only, auto-computed):**
- Subtotal = sum of all line totals
- Tax Amount = subtotal × (taxPercent / 100)
- Grand Total = subtotal + taxAmount

**Notes:**
- Textarea — optional

**Submit buttons:**
- "Save as Draft" → creates invoice with `status: "draft"`
- "Save & Send" → creates invoice with `status: "sent"`

---

### F3 — Edit Invoice

- Only `draft` invoices can be edited
- Pre-fills form with existing invoice data
- Same validation as create
- Same two submit buttons
- Saving updates the invoice in-place

---

### F4 — View Invoice

- Read-only view of the invoice
- Shows all fields in a clean layout
- Status badge
- Grand total prominent
- If status is `draft` → show "Mark as Sent" button
- If status is `sent` → show "Mark as Paid" button
- If status is `paid` → no status action (paid is final)

---

### F5 — Status Transitions

```
draft → sent   (user clicks "Mark as Sent")
sent  → paid   (user clicks "Mark as Paid")
```

No going backwards. `paid` is a terminal state.

---

### F6 — Delete Invoice

- Any invoice can be deleted (any status)
- Show a simple confirmation: `"Delete INV-001? This cannot be undone."`
- Use `window.confirm()` — no custom modal needed

---

### F7 — Summary Dashboard (top of list)

Three stat cards:
- **Total Invoiced** — sum of grand totals of ALL invoices
- **Total Paid** — sum of grand totals of `paid` invoices only
- **Outstanding** — sum of grand totals of `draft` + `sent` invoices

These are **derived**. Do not store them in state.

---

## Constraints

```
1. No external UI library
2. No external state library — useReducer strongly recommended
3. ALL totals (line total, subtotal, tax, grand total) are DERIVED
   Do NOT store them in the invoice object or in state
   Compute them from the items array + taxPercent every time
4. Line items must have their own IDs (for keys and for targeting updates)
5. Due date must be validated as after issue date
6. Only draft invoices can be edited
7. ID auto-increment must be stored in state (not derived from array length)
   Array length changes on delete — that would break ID uniqueness
8. No index as key — use invoice.id and item.id
```

---

## Component Architecture

> **No React Router needed.** This is a single-page app. Use a `currentView` state variable in App to switch between views: `"list"` | `"create"` | `"edit"` | `"view"`. Conditionally render the correct section based on this value.

```js
// App-level view state
const [currentView, setCurrentView] = useState("list")       // which screen to show
const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)  // for edit/view
```

```
App
├── Header
│
├── [currentView === "list"]
│     ├── SummaryStats  (3 stat cards)
│     ├── StatusFilterTabs
│     ├── InvoiceTable
│     │     └── InvoiceRow  (× N)
│     └── EmptyState
│
├── [currentView === "create" | "edit"]
│     ├── ClientInfoSection
│     ├── DateSection
│     ├── LineItemsSection
│     │     └── LineItemRow  (× N)
│     │           └── Remove button
│     ├── AddLineItemButton
│     ├── TaxSection
│     ├── TotalsPreview  (read-only: subtotal, tax, grand total)
│     ├── NotesSection
│     └── SubmitButtons (Save Draft / Save & Send)
│
└── [currentView === "view"]
      ├── InvoiceHeader  (ID, status, dates)
      ├── ClientInfo
      ├── LineItemsTable  (read-only)
      ├── TotalsSection
      ├── Notes
      └── StatusActionButton
```

**Reducer actions:**
```js
{ type: "CREATE_INVOICE",  payload: invoiceData }
{ type: "UPDATE_INVOICE",  payload: { id, invoiceData } }
{ type: "DELETE_INVOICE",  payload: { id } }
{ type: "UPDATE_STATUS",   payload: { id, status } }
{ type: "LOAD_FROM_STORAGE", payload: { invoices, nextId } }
```

---

## Calculation Logic

```js
// Computed values — derive these, never store
function computeTotals(items, taxPercent) {
  const subtotal   = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxAmount  = subtotal * (taxPercent / 100)
  const grandTotal = subtotal + taxAmount
  return {
    subtotal:   Math.round(subtotal   * 100) / 100,
    taxAmount:  Math.round(taxAmount  * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100
  }
}

// Invoice ID generation
function generateId(nextNum) {
  return `INV-${String(nextNum).padStart(3, "0")}`  // INV-001, INV-042
}

// Dashboard summary
function getSummaryStats(invoices) {
  return invoices.reduce((acc, inv) => {
    const { grandTotal } = computeTotals(inv.items, inv.taxPercent)
    acc.totalInvoiced += grandTotal
    if (inv.status === "paid")                             acc.totalPaid += grandTotal
    if (inv.status === "draft" || inv.status === "sent")   acc.outstanding += grandTotal
    return acc
  }, { totalInvoiced: 0, totalPaid: 0, outstanding: 0 })
}
```

---

## localStorage Rules

```js
// Keys: "invoices" and "nextInvoiceId"
useEffect(() => {
  localStorage.setItem("invoices", JSON.stringify(invoices))
  localStorage.setItem("nextInvoiceId", String(nextId))
}, [invoices, nextId])
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] Can create an invoice with multiple line items
- [ ] Line total (qty × price) updates live as user types
- [ ] Can add and remove line items dynamically
- [ ] Subtotal, tax, grand total update live
- [ ] Client email validation works
- [ ] Due date must be after issue date
- [ ] "Save as Draft" and "Save & Send" create with correct status
- [ ] Invoice appears in list with correct total
- [ ] Status filter tabs work with counts
- [ ] Can edit a draft invoice
- [ ] Edit pre-fills all fields correctly
- [ ] Cannot edit sent or paid invoices
- [ ] Can view any invoice in read-only mode
- [ ] "Mark as Sent" works on draft invoices
- [ ] "Mark as Paid" works on sent invoices
- [ ] Delete works with confirmation
- [ ] Summary stats (total invoiced, paid, outstanding) are correct
- [ ] Invoice IDs are sequential (INV-001, INV-002...)
- [ ] Data persists after page refresh
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `useReducer` for invoice state management
- [ ] `useMemo` for computeTotals per invoice in list
- [ ] Invoice ID doesn't reset when invoices are deleted
- [ ] Remove line item button disabled when only 1 item remains
- [ ] Line item row uses its own `id` as key (not index)
- [ ] Date validation: due date after issue date — enforced in form

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── SummaryStats/
│   ├── StatusFilterTabs/
│   ├── InvoiceTable/
│   │   └── InvoiceRow.jsx
│   ├── InvoiceForm/
│   │   ├── ClientInfoSection.jsx
│   │   ├── LineItemRow.jsx
│   │   └── TotalsPreview.jsx
│   └── InvoiceView/
├── reducer/
│   └── invoiceReducer.js
├── utils/
│   └── calculations.js
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT store grand total inside the invoice object — always derive it
❌ Do NOT use array.length to generate invoice IDs (breaks on delete)
❌ Do NOT allow editing sent or paid invoices
❌ Do NOT use index as key on line items
❌ Do NOT skip the due-date-after-issue-date validation
❌ Do NOT allow the remove button to delete the last line item
```

---

## Quick Start

```bash
npm create vite@latest invoice-app -- --template react
cd invoice-app
npm install
npm run dev
```

> No `react-router-dom` needed — this is a single-page app.  
> Use `currentView` state to switch between list / create / edit / view screens.

---

> **Reminder:** Read all requirements before starting.  
> Plan your `currentView` state and reducer actions on paper first.  
> The evaluator will check that grand total is always derived — never stored in the invoice object.
