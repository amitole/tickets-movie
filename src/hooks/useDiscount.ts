import { useState } from 'react';
import { useStore } from '../lib/store';

interface UseDiscountReturn {
  isDiscountApplied: boolean;
  discountMessage: string;
  discountStatus: 'success' | 'error' | null;
  handleApplyDiscount: (code: string) => void;
  calculateDiscount: (subtotal: number) => number;
}

export const useDiscount = (): UseDiscountReturn => {
  const { selectedSeats, setIsDiscountApplied } = useStore();
  const [isLocalDiscountApplied, setLocalDiscountApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const [discountStatus, setDiscountStatus] = useState<'success' | 'error' | null>(null);

  const handleApplyDiscount = (code: string) => {
    if (!code.trim()) {
      setDiscountMessage('Please enter a discount code');
      setDiscountStatus('error');
      return;
    }

    if (selectedSeats.length <= 1) {
      setDiscountMessage('Discount code requires more than 1 ticket');
      setDiscountStatus('error');
      return;
    }

    if (selectedSeats.length % 2 !== 0) {
      setDiscountMessage('Discount code requires an even number of tickets');
      setDiscountStatus('error');
      return;
    }

    if (code.toLowerCase() === 'oneplusone') {
      setLocalDiscountApplied(true);
      setIsDiscountApplied(true);
      setDiscountMessage('Discount code applied successfully!');
      setDiscountStatus('success');
      setTimeout(() => {
        setDiscountMessage('');
        setDiscountStatus(null);
      }, 3000);
    } else {
      setDiscountMessage('Invalid discount code');
      setDiscountStatus('error');
    }
  };

  const calculateDiscount = (subtotal: number): number => {
    return isLocalDiscountApplied ? subtotal * 0.5 : 0;
  };

  return {
    isDiscountApplied: isLocalDiscountApplied,
    discountMessage,
    discountStatus,
    handleApplyDiscount,
    calculateDiscount,
  };
};