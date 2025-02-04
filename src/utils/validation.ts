import { Movie } from "../lib/store";

export const validateSearchTerm = (term: string): string => {
  return term
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const validateMovieFilter = (
  movies: Movie[],
  searchTerm: string,
  selectedGenre: string,
  ratingRange: [number, number]
): Movie[] => {
  const sanitizedSearchTerm = validateSearchTerm(searchTerm.toLowerCase());

  return movies.filter((movie) => {
    const matchesSearch =
      sanitizedSearchTerm === "" ||
      movie.title.toLowerCase().includes(sanitizedSearchTerm);
    const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
    const matchesRating =
      movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];

    return matchesSearch && matchesGenre && matchesRating;
  });
};
