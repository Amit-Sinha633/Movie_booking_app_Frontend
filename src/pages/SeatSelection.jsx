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
import LoadingSpinner from "../components/LoadingSpinner";
import { ChevronRight, Plus, Minus, Ticket } from "lucide-react";
import { toast } from "react-hot-toast";

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedMovie, 
    selectedTheatre, 
    selectedShow, 
    ticketQuantity,
    setTicketQuantity,
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
          let currentMovie = selectedMovie;
          if (!currentMovie) {
            currentMovie = getMovieById(currentShow.movieId) || await movieService.getMovie(currentShow.movieId);
            setSelectedMovie(currentMovie);
          }
          setMovie(currentMovie);

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

  const increment = () => {
    if (ticketQuantity < 10) {
      setTicketQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(prev => prev - 1);
    }
  };

  const handleContinue = async () => {
    if (ticketQuantity < 1) {
      toast.error("Please select at least one ticket to proceed.");
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        movieId: movie._id,
        theatreId: theatre._id,
        showId: show._id,
        timing: show.timing,
        noOfSeats: ticketQuantity,
        totalCosts: subtotal,
        status: "IN_PROCESS",
        movieName: movie.name,
        theatreName: theatre.name
      };

      const booking = await bookingService.createBooking(bookingData);
      
      toast.success("Tickets locked! Proceeding to payment...");
      navigate(`/payment/${booking._id}`, { state: { booking, finalAmount: subtotal } });
    } catch (err) {
      toast.error("Failed to reserve tickets. Please try again.");
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

  const ticketPrice = show.price || 300;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

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

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 rounded-3xl shadow-xl p-8 sm:p-10 transform transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5">
          <div className="flex flex-col items-center text-center space-y-8">
            
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">Select Tickets</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">How many tickets would you like to book?</p>
            </div>

            <div className="flex items-center justify-center gap-6 py-4">
              <button 
                onClick={decrement}
                disabled={ticketQuantity <= 1}
                className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <span className="text-5xl font-black text-slate-800 dark:text-white w-16 text-center tabular-nums tracking-tighter">
                {ticketQuantity}
              </span>
              
              <button 
                onClick={increment}
                disabled={ticketQuantity >= 10}
                className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                <span>Ticket Price</span>
                <span>₹{ticketPrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                <span>Number of Tickets</span>
                <span>x {ticketQuantity}</span>
              </div>
              <div className="h-px w-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between items-center text-lg font-black text-slate-800 dark:text-white">
                <span>Total Amount</span>
                <span className="text-primary">₹{subtotal}</span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={bookingLoading || ticketQuantity < 1}
              className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {bookingLoading ? "Processing..." : "Continue Booking"}
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SeatSelection;
