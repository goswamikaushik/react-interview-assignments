import { useContext } from "react";
import { CartContext } from ".";

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useBookmarks must be inside BookmarkProvider");
  return ctx;
};
