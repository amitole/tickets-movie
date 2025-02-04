import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { Clock, Star } from 'lucide-react';
import { Movie } from '../lib/store';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)'
        }
      }}
      onClick={() => onClick(movie)}
    >
      <CardMedia
        component="img"
        height="200"
        image={movie.imageUrl}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {movie.title}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip 
            label={movie.genre}
            size="small"
            sx={{ bgcolor: 'grey.100' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Star size={16} />
            <Typography variant="body2">{movie.rating}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Clock size={16} />
            <Typography variant="body2">{movie.duration}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}