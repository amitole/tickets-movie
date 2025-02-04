import { useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { AlertModal } from "./AlertModal";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  styled,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Home } from "lucide-react";
import { useTranslationPath } from "../hooks/useTranslationPath";

const SeatButton = styled(Button)(
  ({
    theme,
    status,
  }: {
    theme: any;
    status: "available" | "selected" | "booked";
  }) => ({
    minWidth: "28px",
    width: "28px",
    height: "28px",
    padding: 0,
    margin: "2px",
    fontSize: "0.75rem",
    borderRadius: "4px",
    [theme.breakpoints.up("sm")]: {
      minWidth: "32px",
      width: "32px",
      height: "32px",
      fontSize: "0.875rem",
    },
    ...(status === "available" && {
      backgroundColor: "#4CAF50",
      "&:hover": {
        backgroundColor: "#388E3C",
      },
    }),
    ...(status === "selected" && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
    ...(status === "booked" && {
      backgroundColor: theme.palette.grey[400],
      cursor: "not-allowed",
      "&:hover": {
        backgroundColor: theme.palette.grey[400],
      },
    }),
  })
);

const ScreenShape = styled(Box)(({ theme }) => ({
  width: "50%",
  height: "8px",
  backgroundColor: theme.palette.grey[300],
  borderRadius: theme.shape.borderRadius,
  transform: "perspective(500px) rotateX(30deg)",
  marginBottom: theme.spacing(4),
  marginLeft: "auto",
  marginRight: "auto",
}));

const SeatLegend = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    gap: theme.spacing(3),
  },
}));

const SeatGrid = styled(Box)(({ theme }) => ({
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.grey[100],
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[400],
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: theme.palette.grey[500],
    },
  },
}));

export function SeatMap() {
  const { t: tBooking } = useTranslationPath("booking");
  const { t: tCommon } = useTranslationPath("common");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    seats,
    selectedMovie,
    selectedShowtime,
    toggleSeatSelection,
    selectedSeats,
    validateSeatsForPayment,
    showSeatGapAlert,
    setShowSeatGapAlert,
  } = useStore();

  if (!selectedMovie || !selectedShowtime) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            {tBooking("selectMovieFirst")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            {tBooking("backToMovies")}
          </Button>
        </Paper>
      </Container>
    );
  }

  const rows = [...new Set(seats.map((seat) => seat.row))].sort();
  const seatsPerRow = Math.max(...seats.map((seat) => seat.number));
  const totalPrice = selectedSeats.length * 12;

  const handleProceedToPayment = () => {
    if (validateSeatsForPayment()) {
      navigate("/payment");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {selectedMovie.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {tBooking("showtime", {
                theater: selectedShowtime.theater,
                time: selectedShowtime.startTime,
              })}
            </Typography>
          </Box>

          {selectedSeats.length >= 6 && (
            <Alert severity="info">{tBooking("maxSeatsReached")}</Alert>
          )}

          {/* Legend */}
          <SeatLegend justifyContent="center">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "#4CAF50",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">{tCommon("available")}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">{tCommon("selected")}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "grey.400",
                  borderRadius: 1,
                }}
              />
              <Typography variant="body2">{tCommon("booked")}</Typography>
            </Box>
          </SeatLegend>

          {/* Screen */}
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              px: { xs: 2, sm: 4 },
            }}
          >
            <ScreenShape />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                color: "text.secondary",
              }}
            >
              {tCommon("screen")}
            </Typography>
          </Box>

          {/* Seat Grid */}
          <SeatGrid>
            <Box
              sx={{
                minWidth: isMobile ? seatsPerRow * 32 + 50 : "auto",
                display: "inline-block",
              }}
            >
              {rows.map((row) => (
                <Box
                  key={row}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 0.5,
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      width: 24,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "text.secondary",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    {row}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {Array.from({ length: seatsPerRow }).map((_, index) => {
                      const seat = seats.find(
                        (s) => s.row === row && s.number === index + 1
                      );
                      if (!seat)
                        return (
                          <Box key={index} sx={{ width: { xs: 28, sm: 32 } }} />
                        );

                      return (
                        <SeatButton
                          theme={theme}
                          key={seat.id}
                          variant="contained"
                          status={seat.status}
                          onClick={() => toggleSeatSelection(seat)}
                          disabled={seat.status === "booked"}
                        >
                          {seat.number}
                        </SeatButton>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>
          </SeatGrid>

          {/* Summary and Action */}
          <Box>
            <Divider sx={{ mb: 3 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {tBooking("selectedSeats", {
                    seats: selectedSeats
                      .map((seat) => `${seat.row}${seat.number}`)
                      .join(", "),
                  })}
                </Typography>
                <Typography variant="h6">
                  {tCommon("total")}: ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                disabled={selectedSeats.length === 0}
                onClick={handleProceedToPayment}
                fullWidth={isMobile}
                sx={{ minWidth: { sm: 200 } }}
              >
                {tCommon("proceed")}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <AlertModal
        isOpen={showSeatGapAlert}
        onClose={() => setShowSeatGapAlert(false)}
      />
    </Container>
  );
}
