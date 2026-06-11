import {
  createContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import type {
  BookmarkContextType,
  Movie,
} from "../../features/project-03-movie-search-app/type";

const BookmarkContext = createContext<BookmarkContextType | null>(null);

const init = (): Movie[] => {
  try {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const BookMarkProvider: FC<PropsWithChildren> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Movie[]>(init);

  const toggleBookmark = (movie: Movie) => {
    setBookmarks((prev) =>
      prev.some((b) => b.imdbID === movie.imdbID)
        ? prev.filter((b) => b.imdbID !== movie.imdbID)
        : [...prev, movie],
    );
  };

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (id: string) => bookmarks.some((b) => b.imdbID === id);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, isBookmarked, toggleBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export { BookMarkProvider, BookmarkContext };
