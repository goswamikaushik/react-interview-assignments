import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { MovieDetails } from "./type";
import { Calendar, Clock, ExternalLink, Spinner, Star } from "../../icons";

const MoviesDetails = () => {
  const { imdbId } = useParams();

  const [movieDetails, setMovieDetails] = useState<MovieDetails>({
    data: null,
    isLoading: false,
  });

  console.log("--movieDetails--->", movieDetails);
  console.log("--imdbId--->", imdbId);

  useEffect(() => {
    const fetchMovies = async (id: string) => {
      try {
        setMovieDetails((prev) => ({ ...prev, isLoading: true }));
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=779a9a23&i=${id}`,
        );
        const data = await response.json();
        console.log("----data---.", data);
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
    return <Spinner />;
  }

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <div className="flex gap-10 p-10">
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
            <p className="rounded-xl border text-sm px-3 py-0.5 bg-blue-200">
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
        <a
          href={`https://www.imdb.com/title/${data.imdbID}`}
          className="text-purple-500 flex gap-1"
          target="_blank"
          rel="noreferrer noopener"
        >
          <ExternalLink />
          {data.imdbID}
        </a>
      </div>
    </div>
  );
};

export default MoviesDetails;
