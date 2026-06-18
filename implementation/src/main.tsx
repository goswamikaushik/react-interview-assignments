import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { BookMarkProvider } from "./context/bookmark/index.tsx";
import { CartProvider } from "./context/cart/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <BookMarkProvider>
          <App />
        </BookMarkProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
