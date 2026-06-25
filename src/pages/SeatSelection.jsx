import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import { useMovies } from "../contexts/MovieContext";
import { showService } from "../services/showService";
import { movieService } from "../services/movieService";
import { theatreService } from "../services/theatreService";
import { bookingService } from "../services/bookingService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SeatMap from "../components/SeatMap";
import LoadingSpinner from "../components/LoadingSpinner";
import { Film, MapPin, Compass, Armchair, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedMovie, 
    selectedTheatre, 
    selectedShow, 
    selectedSeats, 
    setSelectedMovie, 
    setSelectedTheatre, 
    setSelectedShow, 
    subtotal, 
    clearBooking 
  } = useBooking();
  const { getMovieById } = useMovies();

  const [show, setShow] = useState(selectedShow);
  const [movie, setMovie] = useState(selectedMovie);
  const [theatre, setTheatre] = useState(selectedTheatre);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const restoreShowState = async () => {
      setLoading(true);
      try {
        let currentShow = selectedShow;
        if (!currentShow) {
          currentShow = await showService.getShowById(showId);
          setSelectedShow(currentShow);
        }
        setShow(currentShow);

        if (currentShow) {
          // Restore movie
          let currentMovie = selectedMovie;
          if (!currentMovie) {
            currentMovie = getMovieById(currentShow.movieId) || await movieService.getMovie(currentShow.movieId);
            setSelectedMovie(currentMovie);
          }
          setMovie(currentMovie);

          // Restore theatre
          let currentTheatre = selectedTheatre;
          if (!currentTheatre) {
            currentTheatre = await theatreService.getTheatre(currentShow.theatreId);
            setSelectedTheatre(currentTheatre);
          }
          setTheatre(currentTheatre);
        }
      } catch (err) {
        console.error("Failed to restore show session details", err);
      } finally {
        setLoading(false);
      }
    };
    restoreShowState();
  }, [showId, selectedShow, selectedMovie, selectedTheatre]);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to proceed.");
      return;
    }

    setBookingLoading(true);
    try {
      // Create a booking on the backend
      const bookingData = {
        movieId: movie._id,
        theatreId: theatre._id,
        timing: show.timing,
        noOfSeats: selectedSeats.length,
        totalCosts: subtotal, // Store raw ticket costs in booking total (fees calculated during summary)
        status: "IN_PROCESS",
        // Frontend-only helpers to pass down
        seats: selectedSeats,
        movieName: movie.name,
        theatreName: theatre.name
      };

      const booking = await bookingService.createBooking(bookingData);
      
      toast.success("Seats locked! Proceeding to summary...");
      navigate(`/booking/${booking._id}`);
    } catch (err) {
      toast.error("Failed to reserve seats. Please try again.");
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!show || !movie || !theatre) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-500 font-bold text-lg">Show details missing.</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-primary text-white rounded font-bold">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse booked seats list from show record
  let bookedList = [];
  try {
    if (show.seatConfigaration) {
      const parsed = JSON.parse(show.seatConfigaration);
      bookedList = parsed.booked || [];
    }
  } catch (e) {
    console.warn("Failed to parse seat config", e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Booking Header Info */}
      <header className="bg-slate-900 text-white py-4 border-b border-slate-850 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{movie.name}</h1>
            <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
              <span>{theatre.name}</span>
              <span>•</span>
              <span className="text-primary">{show.timing}</span>
            </p>
          </div>
          <button
            onClick={() => {
              clearBooking();
              navigate(`/movie/${movie._id}/theatres`);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-350 transition-colors cursor-pointer"
          >
            Change Show
          </button>
        </div>
      </header>

      {/* Main Seat Map Selector */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col items-center">
        <div className="w-full bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-sm p-6 sm:p-8">
          <SeatMap bookedSeats={bookedList} />
        </div>
      </main>

      {/* Bottom Sticky CTA Drawer */}
      {selectedSeats.length > 0 && (
        <div className="sticky bottom-0 z-30 w-full bg-white dark:bg-dark-card border-t border-slate-200/80 dark:border-slate-850 shadow-2xl py-3 sm:py-4 transition-all duration-300">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-3">
            
            <div className="text-left space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Armchair className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"} selected</span>
              </div>
              <p className="text-sm font-black text-slate-850 dark:text-slate-100 flex flex-wrap gap-1 max-w-[150px] sm:max-w-xs md:max-w-sm">
                {selectedSeats.map(seatId => (
                  <span key={seatId} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/60 text-xs border border-slate-200/20">
                    {seatId}
                  </span>
                ))}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase">Subtotal</p>
                <p className="text-lg sm:text-xl font-black text-primary">₹{subtotal}</p>
              </div>

              <button
                onClick={handleContinue}
                disabled={bookingLoading}
                className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                {bookingLoading ? "Reserving..." : "Pay ₹" + subtotal}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default SeatSelection;
