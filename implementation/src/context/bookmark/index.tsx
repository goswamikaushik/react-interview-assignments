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
import { localStorageAction } from "../../utils";

const BookmarkContext = createContext<BookmarkContextType | null>(null);

const init = (): Movie[] => {
  const { get } = localStorageAction();
  try {
    const saved = get("bookmarks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const BookMarkProvider: FC<PropsWithChildren> = ({ children }) => {
  const { set } = localStorageAction();

  const [bookmarks, setBookmarks] = useState<Movie[]>(init);

  const toggleBookmark = (movie: Movie) => {
    setBookmarks((prev) =>
      prev.some((b) => b.imdbID === movie.imdbID)
        ? prev.filter((b) => b.imdbID !== movie.imdbID)
        : [...prev, movie],
    );
  };

  useEffect(() => {
    set("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks, set]);

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
