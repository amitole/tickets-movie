import { validateSearchTerm, validateMovieFilter } from '../../utils/validation';
import { Movie } from '../../lib/store';

describe('validateSearchTerm', () => {
  it('should remove special characters from search term', () => {
    expect(validateSearchTerm('Hello@World!')).toBe('Hello World');
  });

  it('should trim whitespace', () => {
    expect(validateSearchTerm('  hello  world  ')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(validateSearchTerm('')).toBe('');
  });

  it('should preserve numbers', () => {
    expect(validateSearchTerm('Movie 2023')).toBe('Movie 2023');
  });

  it('should handle multiple spaces', () => {
    expect(validateSearchTerm('The   Dark   Knight')).toBe('The Dark Knight');
  });

  it('should handle mixed case', () => {
    expect(validateSearchTerm('ThE DaRk KnIgHt')).toBe('ThE DaRk KnIgHt');
  });
});

describe('validateMovieFilter', () => {
  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Inception',
      genre: 'Sci-Fi',
      rating: 8.8,
      duration: '2h 28m',
      imageUrl: 'test.jpg'
    },
    {
      id: '2',
      title: 'The Dark Knight',
      genre: 'Action',
      rating: 9.0,
      duration: '2h 32m',
      imageUrl: 'test.jpg'
    },
    {
      id: '3',
      title: 'Interstellar',
      genre: 'Sci-Fi',
      rating: 8.6,
      duration: '2h 49m',
      imageUrl: 'test.jpg'
    }
  ];

  it('should filter movies by search term', () => {
    const filtered = validateMovieFilter(mockMovies, 'inception', '', [0, 10]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Inception');
  });

  it('should filter movies by genre', () => {
    const filtered = validateMovieFilter(mockMovies, '', 'Sci-Fi', [0, 10]);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(m => m.title)).toContain('Inception');
    expect(filtered.map(m => m.title)).toContain('Interstellar');
  });

  it('should filter movies by rating range', () => {
    const filtered = validateMovieFilter(mockMovies, '', '', [8.9, 10]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('The Dark Knight');
  });

  it('should return all movies when no filters are applied', () => {
    const filtered = validateMovieFilter(mockMovies, '', '', [0, 10]);
    expect(filtered).toHaveLength(3);
  });

  it('should handle case-insensitive search', () => {
    const filtered = validateMovieFilter(mockMovies, 'DARK', '', [0, 10]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('The Dark Knight');
  });

  it('should handle partial matches in search', () => {
    const filtered = validateMovieFilter(mockMovies, 'inter', '', [0, 10]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Interstellar');
  });

  it('should combine multiple filters', () => {
    const filtered = validateMovieFilter(mockMovies, 'inter', 'Sci-Fi', [8.5, 9.0]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Interstellar');
  });

  it('should handle empty movie list', () => {
    const filtered = validateMovieFilter([], 'test', '', [0, 10]);
    expect(filtered).toHaveLength(0);
  });
});