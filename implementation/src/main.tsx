import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { BookMarkProvider } from "./context/bookmark/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BookMarkProvider>
        <App />
      </BookMarkProvider>
    </BrowserRouter>
  </StrictMode>,
);
