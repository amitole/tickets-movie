import { create } from "zustand";

export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: string;
  imageUrl: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theater: string;
  startTime: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "selected" | "booked";
}

interface BookingStore {
  movies: Movie[];
  showtimes: Showtime[];
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  seats: Seat[];
  showSeatGapAlert: boolean;
  isDiscountApplied: boolean;
  setMovies: (movies: Movie[]) => void;
  setShowtimes: (showtimes: Showtime[]) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  setSeats: (seats: Seat[]) => void;
  toggleSeatSelection: (seat: Seat) => void;
  validateSeatsForPayment: () => boolean;
  setShowSeatGapAlert: (show: boolean) => void;
  setIsDiscountApplied: (isApplied: boolean) => void;
}

export const useStore = create<BookingStore>((set, get) => ({
  movies: [],
  showtimes: [],
  selectedMovie: null,
  selectedShowtime: null,
  selectedSeats: [],
  seats: [],
  showSeatGapAlert: false,
  isDiscountApplied: false,
  setMovies: (movies) => set({ movies }),
  setShowtimes: (showtimes) => set({ showtimes }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setSelectedShowtime: (showtime) => set({ selectedShowtime: showtime }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setSeats: (seats) => set({ seats }),
  setShowSeatGapAlert: (show) => set({ showSeatGapAlert: show }),
  setIsDiscountApplied: (isApplied) => set({ isDiscountApplied: isApplied }),
  toggleSeatSelection: (seat) =>
    set((state) => {
      if (seat.status === "booked") return state;

      const isSelected = seat.status === "selected";

      if (isSelected) {
        const newSelectedSeats = state.selectedSeats.filter(
          (s) => s.id !== seat.id
        );
        const newSeats = state.seats.map((s) =>
          s.id === seat.id ? { ...s, status: "available" } : s
        );
        return { selectedSeats: newSelectedSeats, seats: newSeats };
      }

      if (state.selectedSeats.length >= 6) {
        return state;
      }

      const newSelectedSeats = [
        ...state.selectedSeats,
        { ...seat, status: "selected" },
      ];
      const newSeats = state.seats.map((s) =>
        s.id === seat.id ? { ...s, status: "selected" } : s
      );

      return {
        selectedSeats: newSelectedSeats,
        seats: newSeats,
      };
    }),
  validateSeatsForPayment: () => {
    const state = get();
    const selectedSeats = state.selectedSeats;

    if (selectedSeats.length === 0 || selectedSeats.length === 1) {
      return true;
    }

    const selectedByRow = selectedSeats.reduce((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);

    for (const row in selectedByRow) {
      const rowSeats = state.seats
        .filter((s) => s.row === row)
        .sort((a, b) => a.number - b.number);

      let consecutiveOccupied: number[] = [];
      let currentGroup: number[] = [];

      rowSeats.forEach((seat, index) => {
        if (seat.status === "selected" || seat.status === "booked") {
          currentGroup.push(index);
        } else {
          if (currentGroup.length > 0) {
            consecutiveOccupied.push(...currentGroup);
            currentGroup = [];
          }
        }
      });

      if (currentGroup.length > 0) {
        consecutiveOccupied.push(...currentGroup);
      }

      for (let i = 0; i < consecutiveOccupied.length - 1; i++) {
        const gap = consecutiveOccupied[i + 1] - consecutiveOccupied[i];
        if (gap === 2) {
          set({ showSeatGapAlert: true });
          return false;
        }
      }
    }

    return true;
  },
}));
