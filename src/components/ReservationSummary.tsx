import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Stack, 
  Divider,
  styled,
  Chip
} from '@mui/material';
import { Calendar, MapPin, Users, Check, Home } from 'lucide-react';
import { useStore } from '../lib/store';

const StyledImage = styled('img')({
  width: '120px',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '8px'
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'text.secondary'
});

export function ReservationSummary() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedMovie, selectedShowtime, selectedSeats, isDiscountApplied } = useStore();

  if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
    navigate('/');
    return null;
  }

  const totalPrice = selectedSeats.length * 12;
  const serviceFee = selectedSeats.length * 1.5;
  const subtotal = totalPrice + serviceFee;
  const discount = isDiscountApplied ? subtotal * 0.5 : 0;
  const finalTotal = subtotal - discount;

  const handleBackToHome = () => {
    navigate('/');
  };

  const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Success Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}
            >
              <Check size={32} color="#2e7d32" />
            </Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
              {t('confirmation.success')}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {t('confirmation.successMessage')}
            </Typography>
            <Chip 
              label={t('confirmation.bookingId', { id: bookingId })}
              color="primary"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider />

          {/* Movie Details */}
          <Box display="flex" gap={3}>
            <StyledImage 
              src={selectedMovie.imageUrl} 
              alt={selectedMovie.title}
            />
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                {selectedMovie.title}
              </Typography>
              <Stack spacing={2}>
                <IconWrapper>
                  <Calendar size={20} />
                  <Typography>{selectedShowtime.startTime}</Typography>
                </IconWrapper>
                <IconWrapper>
                  <MapPin size={20} />
                  <Typography>{selectedShowtime.theater}</Typography>
                </IconWrapper>
                <IconWrapper>
                  <Users size={20} />
                  <Typography>
                    {t('payment.ticketCount', { count: selectedSeats.length })} - 
                    {t('payment.seats', { seats: selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ') })}
                  </Typography>
                </IconWrapper>
              </Stack>
            </Box>
          </Box>

          {/* Payment Summary */}
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('confirmation.paymentSummary')}
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">
                  {t('payment.tickets', { count: selectedSeats.length, price: 12 })}
                </Typography>
                <Typography>${totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">{t('payment.serviceFee')}</Typography>
                <Typography>${serviceFee.toFixed(2)}</Typography>
              </Box>
              {isDiscountApplied && (
                <Box display="flex" justifyContent="space-between">
                  <Typography color="success.main">{t('payment.discount')}</Typography>
                  <Typography color="success.main">-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">{t('payment.totalAmount')}</Typography>
                <Typography variant="h6" color="primary.main">
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Instructions */}
          <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              {t('confirmation.instructions')}
            </Typography>
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleBackToHome}
            sx={{ 
              mt: 2,
              '& .MuiButton-startIcon': {
                marginInlineEnd: 1,
                marginInlineStart: -0.5
              }
            }}
            startIcon={<Home />}
          >
            {t('common.bookMoreTickets')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}