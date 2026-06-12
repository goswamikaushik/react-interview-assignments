import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { MovieDetails } from "./type";
import { Calendar, Clock, ExternalLink, Spinner, Star } from "../../icons";
import { SITE_ROUTES } from "../../constants";
import { useBookmarks } from "../../context/bookmark/use-bookmarks";

const { PROJECT_03 } = SITE_ROUTES;

const MoviesDetails = () => {
  const { imdbId } = useParams();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [movieDetails, setMovieDetails] = useState<MovieDetails>({
    data: null,
    isLoading: false,
  });

  useEffect(() => {
    const fetchMovies = async (id: string) => {
      try {
        setMovieDetails((prev) => ({ ...prev, isLoading: true }));
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=779a9a23&i=${id}`,
        );
        const data = await response.json();
        setMovieDetails((prev) => ({ ...prev, data: data ?? null }));
      } catch (error) {
        console.error("Error while fetching movie details", error);
      } finally {
        setMovieDetails((prev) => ({ ...prev, isLoading: false }));
      }
    };

    if (!imdbId) return;
    fetchMovies(imdbId);
  }, [imdbId]);

  const { data, isLoading } = movieDetails;

  if (isLoading) {
    return (
      <div className="flex justify-center mt-52 items-center gap-2">
        Fetching Movie Details
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <div className="p-10">
      <Link
        className="cursor-pointer font-semibold text-blue-700 mb-4 inline-block"
        to={PROJECT_03}
      >{`<-- Back To Home`}</Link>
      <div className="flex gap-10 ">
        <img src={data.Poster} className="rounded-md" />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-bold text-3xl">{data.Title}</p>
            <p className="text-md">{data.Year}</p>
            <p className="rounded-md border text-sm px-1">{data.Rated}</p>
            <p className="rounded-md border text-sm  px-1">{data.Type}</p>
          </div>
          <div className="flex items-center">
            <div className="flex gap-1 mr-1">
              <Star /> <span>{data.imdbRating}/10</span>
            </div>
            <p className="text-sm"> · {data.imdbVotes} votes</p>
          </div>
          <div className="flex gap-1">
            {data.Genre.split(",").map((gen) => (
              <p
                key={gen.trim()}
                className="rounded-xl border text-sm px-3 py-0.5 bg-blue-200"
              >
                {gen}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Clock />
              <p>{data.Runtime}</p>
            </div>
            <div className="flex gap-1">
              <Calendar />
              <p>{data.Released}</p>
            </div>
          </div>
          <hr className="border-t border-gray-500" />
          <p className="italic max-w-3xl">{data.Plot}</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-light">Director</p>
              <p className="text-base font-medium"> {data.Director}</p>
            </div>
            <div>
              <p className="text-xs font-light">Writer</p>
              <p className="text-base font-medium"> {data.Writer}</p>
            </div>
            <div>
              <p className="text-xs font-light">Cast</p>
              <p className="text-base font-medium">{data.Actors}</p>
            </div>
          </div>
          <div className="flex gap-2 ">
            <button
              onClick={() =>
                toggleBookmark({
                  imdbID: data.imdbID,
                  Poster: data.Poster,
                  Title: data.Poster,
                  Type: data.Type,
                  Year: data.Year,
                })
              }
              className={`font-semibold border px-2 py-0.5 rounded-md ${isBookmarked(data.imdbID) ? "bg-blue-300 border-blue-800 " : "bg-green-400 border-green-800 "} `}
            >
              {isBookmarked(data.imdbID) ? "Bookmarked" : "Bookmark"}
            </button>
            <a
              href={`https://www.imdb.com/title/${data.imdbID}`}
              className=" border flex gap-1 border-purple-800 bg-purple-300 font-semibold  px-2 py-0.5 rounded-md"
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink />
              {data.imdbID}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesDetails;
