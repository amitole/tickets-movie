export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface PriceBreakdown {
  totalPrice: number;
  serviceFee: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}