import { Link } from "react-router";
import { SITE_ROUTES } from "../../constants";
import { useBookmarks } from "../../context/bookmark/use-bookmarks";

const { PROJECT_03 } = SITE_ROUTES;

const BookmarksPage = () => {
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <p className="text-center mt-32">
        No bookmarks yet. Start searching and save your favorites.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4 m-10 mx-24">
      {bookmarks.map((m) => (
        <Link key={m.imdbID} to={`${PROJECT_03}/${m.imdbID}`}>
          <div className="rounded-t-md border bg-amber-50">
            <img
              src={m.Poster}
              alt={`${m.Title}'s Image`}
              className="w-full h-96 rounded-t-md"
            />
            <div className="text-center my-4">
              <p className="text-xl font-bold">{m.Title}</p>
              <p>{`(${m.Type} - ${m.Year})`}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(m);
              }}
              className="border-t w-full p-0.5 bg-red-400 font-semibold"
            >
              {isBookmarked(m.imdbID) ? "Remove Bookmark" : "Bookmark"}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BookmarksPage;
