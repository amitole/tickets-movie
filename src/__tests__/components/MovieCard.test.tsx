import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MovieCard } from '../../components/MovieCard';

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  genre: 'Action',
  rating: 8.5,
  duration: '2h 30m',
  imageUrl: 'test.jpg'
};

describe('MovieCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Test Movie'));
    expect(mockOnClick).toHaveBeenCalledWith(mockMovie);
  });

  it('displays movie image with correct alt text', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'test.jpg');
    expect(image).toHaveAttribute('alt', 'Test Movie');
  });
});