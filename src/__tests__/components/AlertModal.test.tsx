import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AlertModal } from '../../components/AlertModal';

describe('AlertModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(<AlertModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Seating Arrangement Issue')).toBeInTheDocument();
    expect(screen.getByText(/Your selection would leave a single seat gap/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AlertModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Adjust Selection button is clicked', () => {
    render(<AlertModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Adjust Selection'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(<AlertModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Seating Arrangement Issue')).not.toBeInTheDocument();
  });
});