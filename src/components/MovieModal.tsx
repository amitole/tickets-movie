import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardMedia, Stack, LinearProgress } from '@mui/material';
import { Clock, Star, Film, MapPin, Calendar } from 'lucide-react';
import { Movie, useStore, Showtime } from '../lib/store';
import { useTranslationPath } from '../hooks/useTranslationPath';
import { Modal } from './common/Modal';

interface MovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const { t: tCommon } = useTranslationPath('common');
  const { t: tMovies } = useTranslationPath('movies');
  const { t: tBooking } = useTranslationPath('booking');
  
  const navigate = useNavigate();
  const { showtimes, setSelectedShowtime } = useStore();
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);

  const movieShowtimes = showtimes.filter(
    showtime => showtime.movieId === movie.id
  );

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtimeId(showtime.id);
    setSelectedShowtime(showtime);
  };

  const handleBuyTickets = () => {
    if (selectedShowtimeId) {
      onClose();
      navigate('/booking');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CardMedia
            component="img"
            image={movie.imageUrl}
            alt={movie.title}
            sx={{ 
              height: 300,
              borderRadius: 1,
              objectFit: 'cover'
            }}
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {movie.title}
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Film size={20} />
              <Typography>{movie.genre}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star size={20} color="#FFB400" />
              <Typography>{tMovies('rating')}: {movie.rating} / 10</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={20} />
              <Typography>{tMovies('duration')}: {movie.duration}</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {tBooking('selectShowtime')}
        </Typography>
        <Stack spacing={2}>
          {movieShowtimes.map((showtime) => (
            <Card
              key={showtime.id}
              variant="outlined"
              sx={{
                p: 2,
                cursor: 'pointer',
                borderColor: selectedShowtimeId === showtime.id ? 'primary.main' : 'divider',
                bgcolor: selectedShowtimeId === showtime.id ? 'primary.light' : 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => handleShowtimeSelect(showtime)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} />
                    <Typography fontWeight="medium">
                      {showtime.theater}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} />
                    <Typography>{showtime.startTime}</Typography>
                  </Box>
                </Stack>
                <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                  <Typography variant="body2" color="text.secondary">
                    {tBooking('seatsAvailable', { count: showtime.availableSeats })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(showtime.availableSeats / showtime.totalSeats) * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={!selectedShowtimeId}
        onClick={handleBuyTickets}
        sx={{ mt: 4 }}
      >
        {selectedShowtimeId ? tCommon('selectSeats') : tBooking('selectShowtime')}
      </Button>
    </Modal>
  );
}