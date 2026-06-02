# 🍕 React Interview Assignment — Project 08
## Food Delivery App (Swiggy/Zomato-lite)

> **Time Limit:** 105 minutes  
> **Difficulty:** Hard  
> **Mock API:** Static JSON files (provided below)  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Mock Data](#mock-data)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [Cart Logic](#cart-logic)
7. [What the Evaluator Checks](#what-the-evaluator-checks)
8. [Folder Structure](#folder-structure)
9. [Do Not Do](#do-not-do)

---

## What You're Building

A food delivery app with restaurant browsing, menu viewing, and cart checkout. Users can:
- Browse restaurants on the home page
- Search and filter restaurants
- Click a restaurant to see its full menu
- Add items to cart (from one restaurant at a time)
- Manage cart (quantity, remove)
- Apply promo code and see order summary
- "Place Order" clears cart and shows confirmation

Three pages. React Router + Context API required.

---

## Mock Data

Create these two files in `src/data/`:

**`src/data/restaurants.js`**
```js
export const RESTAURANTS = [
  { id: "r1", name: "Spice Garden",       cuisine: "Indian",    rating: 4.3, deliveryTime: "30-40 min", minOrder: 150, image: "https://picsum.photos/seed/spice/300/200",    isOpen: true  },
  { id: "r2", name: "Burger Barn",        cuisine: "Fast Food", rating: 4.1, deliveryTime: "20-30 min", minOrder: 100, image: "https://picsum.photos/seed/burger/300/200",   isOpen: true  },
  { id: "r3", name: "Sushi World",        cuisine: "Japanese",  rating: 4.6, deliveryTime: "40-50 min", minOrder: 300, image: "https://picsum.photos/seed/sushi/300/200",    isOpen: true  },
  { id: "r4", name: "Pizza Palace",       cuisine: "Italian",   rating: 4.4, deliveryTime: "25-35 min", minOrder: 200, image: "https://picsum.photos/seed/pizza/300/200",    isOpen: true  },
  { id: "r5", name: "Green Bowl",         cuisine: "Healthy",   rating: 4.2, deliveryTime: "35-45 min", minOrder: 120, image: "https://picsum.photos/seed/bowl/300/200",     isOpen: false },
  { id: "r6", name: "Wok Express",        cuisine: "Chinese",   rating: 3.9, deliveryTime: "30-40 min", minOrder: 150, image: "https://picsum.photos/seed/wok/300/200",      isOpen: true  },
  { id: "r7", name: "Taco Town",          cuisine: "Mexican",   rating: 4.0, deliveryTime: "25-35 min", minOrder: 100, image: "https://picsum.photos/seed/taco/300/200",     isOpen: true  },
  { id: "r8", name: "The Cake Studio",    cuisine: "Desserts",  rating: 4.7, deliveryTime: "20-30 min", minOrder: 80,  image: "https://picsum.photos/seed/cake/300/200",     isOpen: true  },
]
```

**`src/data/menus.js`**
```js
export const MENUS = {
  r1: {
    categories: ["Starters", "Main Course", "Breads", "Desserts"],
    items: [
      { id: "r1-1",  name: "Paneer Tikka",       category: "Starters",     price: 220, isVeg: true,  description: "Grilled cottage cheese with spices" },
      { id: "r1-2",  name: "Chicken 65",          category: "Starters",     price: 260, isVeg: false, description: "Crispy spiced chicken bites" },
      { id: "r1-3",  name: "Dal Makhani",         category: "Main Course",  price: 180, isVeg: true,  description: "Slow-cooked black lentils in cream" },
      { id: "r1-4",  name: "Butter Chicken",      category: "Main Course",  price: 320, isVeg: false, description: "Tender chicken in tomato cream sauce" },
      { id: "r1-5",  name: "Palak Paneer",        category: "Main Course",  price: 240, isVeg: true,  description: "Cottage cheese in spinach gravy" },
      { id: "r1-6",  name: "Garlic Naan",         category: "Breads",       price: 60,  isVeg: true,  description: "Soft bread with garlic butter" },
      { id: "r1-7",  name: "Gulab Jamun",         category: "Desserts",     price: 80,  isVeg: true,  description: "Soft milk dumplings in sugar syrup" },
    ]
  },
  r2: {
    categories: ["Burgers", "Sides", "Drinks"],
    items: [
      { id: "r2-1",  name: "Classic Smash Burger", category: "Burgers", price: 180, isVeg: false, description: "Double smash patty with cheese" },
      { id: "r2-2",  name: "Veggie Supreme",        category: "Burgers", price: 150, isVeg: true,  description: "Crispy veggie patty with coleslaw" },
      { id: "r2-3",  name: "BBQ Chicken Burger",    category: "Burgers", price: 200, isVeg: false, description: "Grilled chicken with BBQ sauce" },
      { id: "r2-4",  name: "Loaded Fries",          category: "Sides",   price: 120, isVeg: true,  description: "Fries topped with cheese and jalapeños" },
      { id: "r2-5",  name: "Onion Rings",           category: "Sides",   price: 90,  isVeg: true,  description: "Crispy beer-battered rings" },
      { id: "r2-6",  name: "Cold Brew Coffee",      category: "Drinks",  price: 80,  isVeg: true,  description: "Smooth cold brew in a bottle" },
      { id: "r2-7",  name: "Mango Shake",           category: "Drinks",  price: 70,  isVeg: true,  description: "Fresh mango blended thick" },
    ]
  },
  r3: {
    categories: ["Sushi Rolls", "Nigiri", "Ramen", "Sides"],
    items: [
      { id: "r3-1",  name: "Dragon Roll",          category: "Sushi Rolls", price: 380, isVeg: false, description: "Prawn tempura topped with avocado" },
      { id: "r3-2",  name: "Avocado Roll",         category: "Sushi Rolls", price: 280, isVeg: true,  description: "Creamy avocado in nori rice" },
      { id: "r3-3",  name: "Salmon Nigiri (2pc)",  category: "Nigiri",      price: 220, isVeg: false, description: "Fresh Atlantic salmon on pressed rice" },
      { id: "r3-4",  name: "Chicken Ramen",        category: "Ramen",       price: 320, isVeg: false, description: "Tonkotsu broth with soft-boiled egg" },
      { id: "r3-5",  name: "Miso Soup",            category: "Sides",       price: 80,  isVeg: true,  description: "Traditional dashi with tofu" },
    ]
  },
  r4: {
    categories: ["Pizzas", "Pasta", "Sides", "Desserts"],
    items: [
      { id: "r4-1",  name: "Margherita Pizza",     category: "Pizzas",   price: 280, isVeg: true,  description: "Classic tomato base, mozzarella, basil" },
      { id: "r4-2",  name: "Pepperoni Feast",      category: "Pizzas",   price: 380, isVeg: false, description: "Double pepperoni, mozzarella overload" },
      { id: "r4-3",  name: "Penne Arrabbiata",     category: "Pasta",    price: 240, isVeg: true,  description: "Spicy tomato sauce with garlic" },
      { id: "r4-4",  name: "Garlic Bread",         category: "Sides",    price: 100, isVeg: true,  description: "Toasted with herb butter" },
      { id: "r4-5",  name: "Tiramisu",             category: "Desserts", price: 180, isVeg: true,  description: "Classic Italian coffee dessert" },
    ]
  },
  r5: {
    categories: ["Salads", "Bowls", "Smoothies", "Snacks"],
    items: [
      { id: "r5-1",  name: "Quinoa Power Bowl",      category: "Bowls",     price: 280, isVeg: true,  description: "Quinoa, roasted veggies, tahini dressing" },
      { id: "r5-2",  name: "Caesar Salad",           category: "Salads",    price: 220, isVeg: true,  description: "Romaine, parmesan, house caesar dressing" },
      { id: "r5-3",  name: "Avocado Toast Bowl",     category: "Bowls",     price: 240, isVeg: true,  description: "Smashed avocado, poached egg, seeds" },
      { id: "r5-4",  name: "Green Detox Smoothie",   category: "Smoothies", price: 160, isVeg: true,  description: "Spinach, banana, almond milk, chia" },
      { id: "r5-5",  name: "Mixed Berries Smoothie", category: "Smoothies", price: 180, isVeg: true,  description: "Blueberry, strawberry, oat milk blend" },
      { id: "r5-6",  name: "Hummus & Veggie Sticks", category: "Snacks",    price: 140, isVeg: true,  description: "House hummus with carrot and cucumber" },
    ]
  },
  r6: {
    categories: ["Dim Sum", "Noodles", "Rice", "Soups"],
    items: [
      { id: "r6-1",  name: "Veg Dim Sum (6pc)",    category: "Dim Sum",  price: 160, isVeg: true,  description: "Steamed vegetable dumplings" },
      { id: "r6-2",  name: "Prawn Har Gow (4pc)",  category: "Dim Sum",  price: 220, isVeg: false, description: "Translucent shrimp dumplings" },
      { id: "r6-3",  name: "Hakka Noodles",        category: "Noodles",  price: 180, isVeg: true,  description: "Stir-fried with vegetables and soy" },
      { id: "r6-4",  name: "Chicken Fried Rice",   category: "Rice",     price: 190, isVeg: false, description: "Wok-tossed with egg and spring onion" },
      { id: "r6-5",  name: "Hot & Sour Soup",      category: "Soups",    price: 120, isVeg: true,  description: "Classic tangy soup with tofu" },
    ]
  },
  r7: {
    categories: ["Tacos", "Burritos", "Sides", "Drinks"],
    items: [
      { id: "r7-1",  name: "Chicken Tacos (2pc)",  category: "Tacos",    price: 180, isVeg: false, description: "Grilled chicken, salsa, sour cream" },
      { id: "r7-2",  name: "Bean & Cheese Taco",   category: "Tacos",    price: 140, isVeg: true,  description: "Refried beans, cheddar, jalapeño" },
      { id: "r7-3",  name: "Beef Burrito",         category: "Burritos", price: 260, isVeg: false, description: "Loaded with beef, rice, beans, guac" },
      { id: "r7-4",  name: "Nachos",               category: "Sides",    price: 150, isVeg: true,  description: "Tortilla chips with salsa and cheese" },
      { id: "r7-5",  name: "Horchata",             category: "Drinks",   price: 80,  isVeg: true,  description: "Sweet rice milk with cinnamon" },
    ]
  },
  r8: {
    categories: ["Cakes", "Pastries", "Shakes"],
    items: [
      { id: "r8-1",  name: "Chocolate Truffle Cake", category: "Cakes",    price: 280, isVeg: true, description: "Dark chocolate ganache, 2 slices" },
      { id: "r8-2",  name: "Red Velvet Cake",        category: "Cakes",    price: 260, isVeg: true, description: "Classic cream cheese frosting" },
      { id: "r8-3",  name: "Croissant",              category: "Pastries", price: 80,  isVeg: true, description: "Buttery, flaky, fresh-baked" },
      { id: "r8-4",  name: "Chocolate Shake",        category: "Shakes",   price: 120, isVeg: true, description: "Thick Belgian chocolate milkshake" },
    ]
  }
}
```

---

## Feature Requirements

### F1 — Home Page (`/`)

- Show all restaurants as cards
- Each `RestaurantCard` shows:
  - Image
  - Name, cuisine type
  - Rating (star + number)
  - Delivery time
  - Minimum order
  - "CLOSED" overlay if `isOpen: false`
  - Clicking navigates to `/restaurant/:id`
  - Closed restaurants are not clickable (or show a toast "Currently unavailable")
- Search by restaurant name (real-time, case-insensitive)
- Filter by cuisine (dropdown — "All" + unique cuisines from data)
- Show/hide closed restaurants toggle (default: show all)

---

### F2 — Restaurant Page (`/restaurant/:id`)

- Load restaurant data and menu from mock data by ID
- Show restaurant info at top (name, cuisine, rating, delivery time)
- Menu grouped by category (each category is a section heading)
- Each `MenuItemCard` shows:
  - Veg/non-veg indicator (green dot = veg, red dot = non-veg)
  - Item name + description
  - Price
  - Add to cart button:
    - If item not in cart → "Add +" button
    - If item in cart → quantity control (`−` / count / `+`)
- **Cart conflict warning:** If user has items from a different restaurant and tries to add from this one:
  - Show confirmation: `"You have items from [other restaurant]. Clear cart and add from [this restaurant]?"`
  - If confirmed → clear cart and add new item
  - If cancelled → do nothing

---

### F3 — Cart (persistent sidebar or dedicated page)

Accessible from all pages via header icon.

- Shows all cart items
- Each item: name, quantity controls, line total
- Remove item button
- Restaurant name shown at top of cart
- Order summary:
  - Subtotal
  - Delivery fee: flat ₹40 if subtotal < ₹300, else free
  - Promo code input + Apply
  - Discount amount
  - Grand total
- Minimum order warning: if subtotal < restaurant's `minOrder`, show `"Add ₹X more to place order"`
- "Place Order" button:
  - Disabled if subtotal < minOrder
  - On click → show success message `"Order placed! Your food is on the way 🎉"` → clear cart

**Valid promo codes:**

| Code | Discount |
|---|---|
| `FIRST50` | ₹50 flat off |
| `SAVE15`  | 15% off subtotal |
| `FREE`    | Free delivery (removes delivery fee) |

---

### F4 — Navigation Header

- App name / logo
- Cart icon with item count badge
- On mobile-width: hamburger menu optional

---

## Constraints

```
1. React Router v6 required
2. Cart state must be global — Context API required
3. No external state library
4. Cart conflict logic is mandatory — adding from restaurant B when cart has restaurant A
   must prompt the user, not silently clear
5. Delivery fee logic is derived — do NOT store it in state
6. Minimum order check is derived — do NOT store it in state
7. "Place Order" must be disabled if minOrder not met
8. No external component library
9. No index as key
```

---

## Component Architecture

```
App  (Router + CartContext)
├── Header  (with cart icon + count)
│
├── Route: /
│     └── HomePage
│           ├── SearchBar
│           ├── CuisineFilter
│           ├── ClosedToggle
│           └── RestaurantGrid
│                 └── RestaurantCard  (× N)
│
├── Route: /restaurant/:id
│     └── RestaurantPage
│           ├── RestaurantInfo
│           └── MenuSection  (× category)
│                 └── MenuItemCard  (× N)
│
└── CartSidebar  (always rendered, shown/hidden)
      ├── CartItem  (× N)
      └── OrderSummary
            └── PromoCodeInput
```

**CartContext shape:**
```js
{
  cartItems: [],            // [{ item, quantity, restaurantId, restaurantName }]
  restaurantId: null,       // which restaurant the current cart is from
  restaurantName: null,
  addItem(item, restaurantId, restaurantName),
  removeItem(itemId),
  updateQuantity(itemId, delta),   // +1 or -1
  clearCart(),
  appliedPromo: null,
  applyPromo(code),
  removePromo()
}
```

---

## Cart Logic

```js
// Delivery fee — derived
const subtotal     = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)
const deliveryFee  = subtotal > 0 && subtotal < 300 ? 40 : 0

// Promo discount — derived
const getDiscount = (promo, subtotal) => {
  if (!promo) return 0
  if (promo.code === "FIRST50")  return 50
  if (promo.code === "SAVE15")   return Math.round(subtotal * 0.15)
  if (promo.code === "FREE")     return 0   // handled by setting deliveryFee to 0
  return 0
}

const freeDelivery  = appliedPromo?.code === "FREE"
const finalDelivery = freeDelivery ? 0 : deliveryFee
const discount      = getDiscount(appliedPromo, subtotal)
const grandTotal    = Math.max(0, subtotal + finalDelivery - discount)
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] Restaurant list loads from mock data
- [ ] Search filters restaurants by name
- [ ] Cuisine filter works
- [ ] Closed restaurants show overlay and are non-clickable
- [ ] Restaurant page shows correct menu grouped by category
- [ ] Veg/non-veg indicator shown per item
- [ ] "Add +" button adds item to cart
- [ ] If item already in cart — shows quantity control inline
- [ ] Cart conflict warning shown when adding from different restaurant
- [ ] Cart shows items, quantities, line totals
- [ ] Delivery fee applies below ₹300, free above
- [ ] Promo codes work correctly
- [ ] Minimum order warning shown correctly
- [ ] "Place Order" disabled below minimum order
- [ ] "Place Order" clears cart and shows confirmation
- [ ] Cart item count in header is correct
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] Cart persists in localStorage (survives refresh)
- [ ] `useReducer` for cart state
- [ ] `React.memo` on `MenuItemCard` (menu has many items)
- [ ] `useCallback` on cart action functions
- [ ] Cuisine list derived from restaurant data (not hardcoded)
- [ ] Show/hide closed restaurants toggle works

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── RestaurantCard/
│   ├── MenuItemCard/
│   ├── CartSidebar/
│   ├── CartItem/
│   ├── OrderSummary/
│   └── PromoCodeInput/
├── pages/
│   ├── HomePage.jsx
│   └── RestaurantPage.jsx
├── context/
│   └── CartContext.jsx
├── data/
│   ├── restaurants.js
│   └── menus.js
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT silently clear cart when user adds from a different restaurant
❌ Do NOT store delivery fee or grand total in state — derive them
❌ Do NOT enable "Place Order" when below minimum order
❌ Do NOT use index as key
❌ Do NOT let cart state live only in one page's useState
```

---

## Quick Start

```bash
npm create vite@latest food-delivery-app -- --template react
cd food-delivery-app
npm install react-router-dom
npm run dev
```

---

> **Reminder:** Read all requirements before starting.  
> The cart conflict warning (adding from restaurant B when cart has restaurant A) is the most common thing candidates skip.  
> Plan your CartContext shape on paper before writing any component.
