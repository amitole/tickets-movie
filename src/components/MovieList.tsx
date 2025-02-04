import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Grid, 
  TextField, 
  MenuItem, 
  InputAdornment,
  Slider,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { MovieCard } from './MovieCard';
import { MovieModal } from './MovieModal';
import { useStore, Movie } from '../lib/store';
import { validateSearchTerm, validateMovieFilter } from '../utils/validation';

export function MovieList() {
  const { t } = useTranslation();
  const { movies, setSelectedMovie } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [selectedMovie, setModalMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState<string>('');

  const genres = [...new Set(movies.map(movie => movie.genre))];

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalMovie(movie);
  };

  const handleCloseModal = () => {
    setModalMovie(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = validateSearchTerm(value);
    
    if (value !== sanitizedValue) {
      setSearchError(t('movies.searchError'));
      setTimeout(() => setSearchError(''), 3000);
    } else {
      setSearchError('');
    }
    
    setSearchTerm(sanitizedValue);
  };

  const filteredMovies = validateMovieFilter(movies, searchTerm, selectedGenre, ratingRange);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder={t('movies.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              error={!!searchError}
              helperText={searchError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label={t('movies.genre')}
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <MenuItem value="">{t('movies.allGenres')}</MenuItem>
              {genres.map(genre => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>{t('movies.rating')}</Typography>
            <Slider
              value={ratingRange}
              onChange={(e, newValue) => setRatingRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 5, label: '5' },
                { value: 10, label: '10' }
              ]}
            />
          </Grid>
        </Grid>
      </Paper>

      {filteredMovies.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('movies.noResults')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard
              movie={movie}
              onClick={handleMovieClick}
            />
          </Grid>
        ))}
      </Grid>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
}