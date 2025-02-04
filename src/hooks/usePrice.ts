import { useStore } from '../lib/store';

interface PriceCalculation {
  totalPrice: number;
  serviceFee: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
}

export const usePrice = (discount: number = 0): PriceCalculation => {
  const { selectedSeats } = useStore();

  const totalPrice = selectedSeats.length * 12;
  const serviceFee = selectedSeats.length * 1.5;
  const subtotal = totalPrice + serviceFee;
  const finalTotal = subtotal - discount;

  return {
    totalPrice,
    serviceFee,
    subtotal,
    discount,
    finalTotal,
  };
};