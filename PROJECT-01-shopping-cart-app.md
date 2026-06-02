# 🛒 React Interview Assignment — Project 01
## Shopping Cart App

> **Time Limit:** 90 minutes  
> **Difficulty:** Medium–Hard  
> **Mock API:** https://fakestoreapi.com  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Mock API Reference](#mock-api-reference)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [Promo Code Logic](#promo-code-logic)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A product listing and shopping cart app. Users can:
- Browse products fetched from an API
- Search and filter products
- Add products to a cart
- Manage cart (quantity, remove)
- Apply a promo code
- See a live order summary
- Cart should survive a page refresh

No authentication. No backend. No payments. Frontend only.

---

## Mock API Reference

**Base URL:** `https://fakestoreapi.com`

| Endpoint | Method | What it returns |
|---|---|---|
| `/products` | GET | All products (20 items) |
| `/products/categories` | GET | List of category strings |
| `/products/category/{name}` | GET | Products in that category |
| `/products/{id}` | GET | Single product by ID |

**Single product shape:**

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack",
  "price": 109.95,
  "description": "Your perfect pack for everyday use...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fAn1.jpg",
  "rating": {
    "rate": 3.9,
    "count": 120
  }
}
```

> **Note:** Fetch ALL products on initial load using `/products`. Use the `category` field on each product for client-side filtering. Do NOT make a separate API call per category filter.

---

## Feature Requirements

### F1 — Product Listing Page

- Fetch all products from `/products` on mount
- Show a loading spinner while fetching
- Show an error message if the fetch fails (handle the catch)
- Render each product as a `ProductCard` component
- Each `ProductCard` must show:
  - Product image
  - Product title (truncate to 2 lines max with CSS)
  - Price (formatted as `₹` or `$` — pick one, stay consistent)
  - Category label (badge/tag style)
  - Star rating (show `rating.rate` out of 5)
  - "Add to Cart" button

---

### F2 — Search

- Text input at the top of the product listing
- Filters products in real-time as user types
- Match against product `title` (case-insensitive)
- Search works **alongside** the active category filter
  - i.e. if "electronics" is selected and user searches "cable" → show only electronics products matching "cable"
- Clearing search shows all products in the current active category

---

### F3 — Category Filter

- Render one button/tab per category (fetch from `/products/categories` OR derive from product data — your choice)
- Add an "All" option that shows all categories
- Active category is visually highlighted
- Category filter and search work together (see F2)

---

### F4 — Cart Sidebar / Panel

- Clicking "Add to Cart" adds the product to the cart
- If product already in cart, increase quantity by 1
- Cart shows:
  - Product thumbnail + name
  - Quantity controls (`-` button, quantity display, `+` button)
  - Line item total (`price × quantity`)
  - Remove button (removes item entirely)
- Cart item count visible on the cart icon/header at all times
- Cart can be shown as a sidebar, drawer, or separate section — your choice

---

### F5 — Order Summary

- Always visible when cart has items (or inside the cart panel)
- Shows:
  - Subtotal (sum of all line items before discount)
  - Discount amount (if promo applied)
  - Final total (subtotal − discount)
- Updates live as cart changes

---

### F6 — Promo Code

- Text input + "Apply" button
- Valid promo codes:

| Code | Discount |
|---|---|
| `SAVE10` | 10% off subtotal |
| `SAVE20` | 20% off subtotal |
| `FLAT50` | Flat ₹50 / $50 off subtotal |
| `NEWUSER` | 15% off subtotal |

- Show success message when valid code is applied: `"Promo applied! You saved $X"`
- Show error message for invalid code: `"Invalid promo code"`
- Only ONE promo code can be active at a time
- "Remove" option to clear the applied promo
- Discount cannot make total go below $0 (floor at $0)

---

### F7 — localStorage Persistence

- Cart state must be saved to localStorage on every change
- On page load, read cart from localStorage and restore it
- Key name: `"cart"`
- If localStorage data is corrupt/unparseable, start with empty cart (handle the error)

---

## Constraints

These are hard rules. Violating these will fail the evaluation.

```
1. No CSS framework allowed (no Bootstrap, no Tailwind, no Chakra)
   Write your own CSS — plain CSS, CSS modules, or styled-components only.

2. No external cart/state library (no Redux, no Zustand, no MobX)
   Use only useState, useReducer, useContext, and useEffect.

3. No useEffect for derived data
   Subtotal, discount, filtered products — these are DERIVED STATE.
   Compute them inside the render. Do NOT put them in useEffect + setState.

4. Product data must come from the API
   Do NOT hardcode products. Do NOT use a local JSON file.

5. Search and filter must be client-side
   Do NOT make a new API call when user types or selects a category.

6. Cart must be lifted to a shared state
   ProductCard and CartSidebar both need cart access.
   Do NOT pass cart down through 4+ levels of props — use Context.

7. Loading and error states are required
   A UI with no loading indicator on a network call is an automatic deduction.
```

---

## Component Architecture

This is the **recommended** structure. You may adjust it, but every component listed here must exist.

```
App
├── Header
│     ├── Logo / App name
│     └── CartIcon  (shows item count badge)
│
├── ProductSection
│     ├── SearchBar
│     ├── CategoryFilter
│     └── ProductGrid
│           └── ProductCard  (× N)
│
└── CartSidebar  (or CartPanel)
      ├── CartItem  (× N)
      │     └── QuantityControl
      └── OrderSummary
            └── PromoCodeInput
```

**State that needs to be global (Context):**
- `cartItems` — array of `{ product, quantity }`
- `addToCart(product)`
- `removeFromCart(productId)`
- `updateQuantity(productId, newQuantity)`
- `clearCart()`
- `appliedPromo` — the active promo code object or null

**State that stays local:**
- `products` — in ProductSection (comes from API)
- `searchQuery` — in SearchBar or ProductSection
- `activeCategory` — in CategoryFilter or ProductSection
- `promoInput` — in PromoCodeInput (the text field value)
- `promoError` / `promoSuccess` — in PromoCodeInput

---

## Promo Code Logic

```
subtotal = sum of (item.product.price × item.quantity) for all cart items

if promo is percentage (SAVE10, SAVE20, NEWUSER):
  discountAmount = subtotal × (percentValue / 100)

if promo is flat (FLAT50):
  discountAmount = 50

finalTotal = Math.max(0, subtotal - discountAmount)
```

> `Math.max(0, ...)` ensures total never goes negative.

These values are **derived** — compute them directly from `cartItems` and `appliedPromo`. Do not store them as state.

---

## localStorage Rules

```js
// On cart change — save
localStorage.setItem("cart", JSON.stringify(cartItems))

// On app load — restore
try {
  const saved = localStorage.getItem("cart")
  if (saved) return JSON.parse(saved)
} catch {
  return []   // corrupt data → start fresh
}
```

Implement this inside your CartContext provider using `useEffect` (watching `cartItems`).

---

## What the Evaluator Checks

### ✅ Must Pass (Non-negotiable)

- [ ] Products load from `https://fakestoreapi.com/products`
- [ ] Loading state shown during fetch
- [ ] Error state shown if fetch fails
- [ ] Search filters products by title in real-time
- [ ] Category filter works and combines with search
- [ ] Add to Cart adds product to cart
- [ ] Adding same product again increases quantity (not duplicates)
- [ ] Quantity `+` / `−` buttons work correctly
- [ ] `−` at quantity 1 removes the item (or disables — pick one, be consistent)
- [ ] Remove button removes item from cart
- [ ] Subtotal is correct at all times
- [ ] At least 2 promo codes work correctly
- [ ] Invalid promo code shows error
- [ ] Final total updates after promo applied
- [ ] Cart count in header reflects actual item count
- [ ] Cart persists after page refresh (localStorage)
- [ ] No console errors in normal usage flow

### ⭐ Senior-Level Bonus (Impresses the evaluator)

- [ ] Debounced search (300ms delay — no excessive re-renders on every keystroke)
- [ ] `useReducer` used for cart logic instead of multiple `useState` calls
- [ ] `React.memo` on `ProductCard` (prevents re-render when cart changes)
- [ ] `useCallback` on cart action functions passed as props
- [ ] Empty cart state (a visual placeholder, not just blank space)
- [ ] "Add to Cart" button changes to "In Cart ✓" if product is already added
- [ ] Quantity can't go below 1 from the `−` button (either disabled or removes item)
- [ ] Promo code input clears on apply (success or failure feedback shown instead)

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── ProductCard/
│   │   ├── ProductCard.jsx
│   │   └── ProductCard.css
│   ├── SearchBar/
│   │   └── SearchBar.jsx
│   ├── CategoryFilter/
│   │   └── CategoryFilter.jsx
│   ├── CartSidebar/
│   │   ├── CartSidebar.jsx
│   │   └── CartSidebar.css
│   ├── CartItem/
│   │   └── CartItem.jsx
│   └── OrderSummary/
│       ├── OrderSummary.jsx
│       └── OrderSummary.css
│
├── context/
│   └── CartContext.jsx       ← global cart state lives here
│
├── hooks/
│   └── useProducts.js        ← fetch logic in a custom hook
│
├── utils/
│   └── promocodes.js         ← promo code map and calculator
│
├── App.jsx
└── main.jsx
```

> You don't have to match this exactly. But having a `context/` folder and a `hooks/` folder signals seniority to the evaluator.

---

## Do Not Do

```
❌ Do NOT fetch products inside useEffect every time a filter changes
❌ Do NOT store subtotal or finalTotal in useState
❌ Do NOT declare CartItem or ProductCard inside another component
❌ Do NOT use index as key in any list render
❌ Do NOT ignore the loading and error states
❌ Do NOT make the cart state live inside a single component's useState
   and then prop-drill it 4 levels down
❌ Do NOT apply promo code silently — always show feedback
❌ Do NOT let the cart total go negative
```

---

## Quick Start

```bash
npm create vite@latest shopping-cart-app -- --template react
cd shopping-cart-app
npm install
npm run dev
```

No additional dependencies required.  
If you want to use `axios` instead of `fetch` — that's fine.  
If you want CSS modules — that's fine.  
Everything else: build it yourself.

---

> **Reminder:** Read all requirements before starting.  
> Plan your component tree and state shape on paper first.  
> The evaluator is watching your architecture decisions, not just whether it "works."
