import { Box, Typography, Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useTranslationPath } from '../hooks/useTranslationPath';
import { Modal } from './common/Modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const { t: tCommon } = useTranslationPath('common');
  const { t: tBooking } = useTranslationPath('booking');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
    >
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" p={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <AlertTriangle color="error" />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {tBooking('seatGapTitle')}
        </Typography>
        
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {tBooking('seatGapMessage')}
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={onClose}
          sx={{ minWidth: 200 }}
        >
          {tBooking('adjustSelection')}
        </Button>
      </Box>
    </Modal>
  );
}