export interface MoviesData {
  data: Movie[];
  isLoading: boolean;
  search: string;
}

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails {
  data: MovieDetail | null;
  isLoading: boolean;
}

export interface BookmarkContextType {
  bookmarks: Movie[];
  toggleBookmark: (movie: Movie) => void;
  isBookmarked: (id: string) => boolean;
}
