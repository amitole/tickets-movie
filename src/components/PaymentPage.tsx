import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../lib/store';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
  styled
} from '@mui/material';

const StyledImage = styled('img')({
  width: '96px',
  height: '144px',
  objectFit: 'cover',
  borderRadius: '8px'
});

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'text.secondary'
});

export function PaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedMovie, selectedShowtime, selectedSeats, setIsDiscountApplied } = useStore();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [discountStatus, setDiscountStatus] = useState<'success' | 'error' | null>(null);
  const [errors, setErrors] = useState<{ email?: string; fullName?: string }>({});
  const [isDiscountApplied, setLocalDiscountApplied] = useState(false);

  if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
    navigate('/');
    return null;
  }

  const totalPrice = selectedSeats.length * 12;
  const serviceFee = selectedSeats.length * 1.5;
  const subtotal = totalPrice + serviceFee;
  const discount = isDiscountApplied ? subtotal * 0.5 : 0;
  const finalTotal = subtotal - discount;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; fullName?: string } = {};

    if (!email) {
      newErrors.email = t('payment.errors.emailRequired');
    } else if (!validateEmail(email)) {
      newErrors.email = t('payment.errors.emailInvalid');
    }

    if (!fullName) {
      newErrors.fullName = t('payment.errors.nameRequired');
    } else if (fullName.trim().split(' ').length < 2) {
      newErrors.fullName = t('payment.errors.fullNameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountMessage(t('payment.enterCode'));
      setDiscountStatus('error');
      return;
    }

    if (selectedSeats.length <= 1) {
      setDiscountMessage(t('payment.minTickets'));
      setDiscountStatus('error');
      return;
    }

    if (selectedSeats.length % 2 !== 0) {
      setDiscountMessage(t('payment.evenTickets'));
      setDiscountStatus('error');
      return;
    }

    if (discountCode.toLowerCase() === 'oneplusone') {
      setLocalDiscountApplied(true);
      setIsDiscountApplied(true);
      setDiscountMessage(t('payment.discountApplied'));
      setDiscountStatus('success');
      setDiscountCode('');
      setTimeout(() => {
        setDiscountMessage('');
        setDiscountStatus(null);
      }, 3000);
    } else {
      setDiscountMessage(t('payment.invalidCode'));
      setDiscountStatus('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/confirmation');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t('payment.reservationSummary')}
            </Typography>
            
            <Stack spacing={3}>
              <Box display="flex" gap={2}>
                <StyledImage 
                  src={selectedMovie.imageUrl} 
                  alt={selectedMovie.title}
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedMovie.title}
                  </Typography>
                  <Stack spacing={1}>
                    <IconWrapper>
                      <Calendar size={16} />
                      <Typography variant="body2">{selectedShowtime.startTime}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <MapPin size={16} />
                      <Typography variant="body2">{selectedShowtime.theater}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <Users size={16} />
                      <Typography variant="body2">
                        {t('payment.ticketCount', { count: selectedSeats.length })} - 
                        {t('payment.seats', { seats: selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ') })}
                      </Typography>
                    </IconWrapper>
                  </Stack>
                </Box>
              </Box>

              <Divider />

              <Stack spacing={1}>
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
                  <Typography variant="h6">${finalTotal.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Ticket size={20} />
              <Typography variant="h6">{t('payment.contactDetails')}</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label={t('payment.fullName')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  fullWidth
                  placeholder={t('payment.fullNamePlaceholder')}
                />

                <TextField
                  label={t('payment.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  placeholder={t('payment.emailPlaceholder')}
                />

                {!isDiscountApplied && (
                  <Box>
                    <Box display="flex" gap={1}>
                      <TextField
                        label={t('payment.discountCode')}
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        fullWidth
                        placeholder={t('payment.discountPlaceholder')}
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        variant="outlined"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {t('payment.apply')}
                      </Button>
                    </Box>
                    {discountMessage && (
                      <Alert 
                        severity={discountStatus === 'success' ? 'success' : 'error'}
                        sx={{ mt: 1 }}
                      >
                        {discountMessage}
                      </Alert>
                    )}
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  {t('payment.payButton', { amount: finalTotal.toFixed(2) })}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}