import { renderHook, act } from '@testing-library/react';
import { useDiscount } from '../../hooks/useDiscount';
import { useStore } from '../../lib/store';

// Mock the entire module
jest.mock('../../lib/store', () => ({
  useStore: jest.fn()
}));

describe('useDiscount', () => {
  const mockSetIsDiscountApplied = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as unknown as jest.Mock).mockImplementation(() => ({
      selectedSeats: [{ id: '1' }, { id: '2' }],
      setIsDiscountApplied: mockSetIsDiscountApplied
    }));
  });

  it('should handle valid discount code', () => {
    const { result } = renderHook(() => useDiscount());

    act(() => {
      result.current.handleApplyDiscount('oneplusone');
    });

    expect(result.current.isDiscountApplied).toBe(true);
    expect(result.current.discountStatus).toBe('success');
    expect(mockSetIsDiscountApplied).toHaveBeenCalledWith(true);
  });

  it('should reject invalid discount code', () => {
    const { result } = renderHook(() => useDiscount());

    act(() => {
      result.current.handleApplyDiscount('invalid');
    });

    expect(result.current.isDiscountApplied).toBe(false);
    expect(result.current.discountStatus).toBe('error');
    expect(mockSetIsDiscountApplied).not.toHaveBeenCalled();
  });

  it('should calculate correct discount amount', () => {
    const { result } = renderHook(() => useDiscount());

    act(() => {
      result.current.handleApplyDiscount('oneplusone');
    });

    const discount = result.current.calculateDiscount(100);
    expect(discount).toBe(50);
  });

  it('should validate number of tickets', () => {
    (useStore as unknown as jest.Mock).mockImplementation(() => ({
      selectedSeats: [{ id: '1' }],
      setIsDiscountApplied: mockSetIsDiscountApplied
    }));

    const { result } = renderHook(() => useDiscount());

    act(() => {
      result.current.handleApplyDiscount('oneplusone');
    });

    expect(result.current.discountStatus).toBe('error');
    expect(result.current.discountMessage).toBe('Discount code requires more than 1 ticket');
  });

  it('should require even number of tickets', () => {
    (useStore as unknown as jest.Mock).mockImplementation(() => ({
      selectedSeats: [{ id: '1' }, { id: '2' }, { id: '3' }],
      setIsDiscountApplied: mockSetIsDiscountApplied
    }));

    const { result } = renderHook(() => useDiscount());

    act(() => {
      result.current.handleApplyDiscount('oneplusone');
    });

    expect(result.current.discountStatus).toBe('error');
    expect(result.current.discountMessage).toBe('Discount code requires an even number of tickets');
  });

  it('should handle empty discount code', () => {
    const { result } = renderHook(() => useDiscount());

    act(() => {
      result.current.handleApplyDiscount('');
    });

    expect(result.current.discountStatus).toBe('error');
    expect(result.current.discountMessage).toBe('Please enter a discount code');
  });
});