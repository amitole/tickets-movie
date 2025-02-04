import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { MovieList } from "./components/MovieList";
import { SeatMap } from "./components/SeatMap";
import { PaymentPage } from "./components/PaymentPage";
import { ReservationSummary } from "./components/ReservationSummary";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useStore } from "./lib/store";

const mockMovies = [
  {
    id: "1",
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
    duration: "2h 28m",
    imageUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRRyuWmayVBvqjd1MxTKpRgauq2cCtUzb7Q9QvaFTkAuxAU_EYMoCE3wBuJeftxIzf0grreIw",
  },
  {
    id: "2",
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
    duration: "2h 32m",
    imageUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTfE_qrYMBZ_JB8om-34WGaZARhpX26yWRttqIDvn4_7l--UzX8mxKcPrc59IcvTpEA_G8gPA",
  },
  {
    id: "3",
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 8.6,
    duration: "2h 49m",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSngBJ0B7UDrLUkDlp6DCQLsEYuWR-DiHwbnxFFCniB3HiP3f3NZmR1-lKSC34ge6YXu4LX",
  },
  {
    id: "4",
    title: "The Shawshank Redemption",
    genre: "Drama",
    rating: 9.3,
    duration: "2h 22m",
    imageUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSf1DK32xKMQzqSl8wnY1BLVu_gdwsRYzVSNM6A03r6c-fEwrif8raKzkFRuerw1KHdDICvOw",
  },
];

const mockShowtimes = [
  {
    id: "1",
    movieId: "1",
    theater: "Cinema City - Hall 1",
    startTime: "2024-03-20 14:30",
    availableSeats: 45,
    totalSeats: 100,
  },
  {
    id: "2",
    movieId: "1",
    theater: "Cinema City - Hall 2",
    startTime: "2024-03-20 17:00",
    availableSeats: 80,
    totalSeats: 100,
  },
  {
    id: "3",
    movieId: "2",
    theater: "Cinema City - IMAX",
    startTime: "2024-03-20 15:00",
    availableSeats: 30,
    totalSeats: 150,
  },
  {
    id: "4",
    movieId: "3",
    theater: "Cinema City - Hall 3",
    startTime: "2024-03-20 16:30",
    availableSeats: 60,
    totalSeats: 100,
  },
];

function App() {
  const { setMovies, setShowtimes, setSeats, selectedShowtime } = useStore();

  useEffect(() => {
    setMovies(mockMovies);
    setShowtimes(mockShowtimes);
  }, [setMovies, setShowtimes]);

  useEffect(() => {
    if (selectedShowtime) {
      const mockSeats = generateMockSeats(selectedShowtime.id);
      setSeats(mockSeats);
    }
  }, [selectedShowtime, setSeats]);

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cinema City By AT&T
            </Typography>
            <LanguageSwitcher />
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/booking" element={<SeatMap />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ReservationSummary />} />
        </Routes>
      </Box>
    </Router>
  );
}

const generateMockSeats = (showtimeId: string) => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${showtimeId}-${row}${i}`,
        row,
        number: i,
        status: Math.random() > 0.2 ? "available" : "booked",
      } as const);
    }
  }

  return seats;
};

export default App;
