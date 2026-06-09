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
