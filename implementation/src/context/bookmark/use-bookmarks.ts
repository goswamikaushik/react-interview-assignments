import { useContext } from "react";
import { BookmarkContext } from ".";

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be inside BookmarkProvider");
  return ctx;
};
