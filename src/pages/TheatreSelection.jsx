import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import { useMovies } from "../contexts/MovieContext";
import { theatreService } from "../services/theatreService";
import { showService } from "../services/showService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { MapPin, Calendar, Compass, ShieldCheck } from "lucide-react";

function TheatreSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedMovie, selectTheatreAndShow } = useBooking();
  const { selectedCity, getMovieById } = useMovies();
  
  const [movie, setMovie] = useState(selectedMovie);
  const [theatres, setTheatres] = useState([]);
  const [theatreShows, setTheatreShows] = useState({}); // { theatreId: [shows] }
  const [loading, setLoading] = useState(true);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);

  // Restore movie from ID if refreshed
  useEffect(() => {
    if (!movie) {
      const found = getMovieById(id);
      if (found) {
        setMovie(found);
      }
    }
  }, [id, movie, getMovieById]);

  useEffect(() => {
    const loadTheatresAndShows = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Get all theatres in selected city
        const cityTheatres = await theatreService.getTheatres(selectedCity);
        
        // Filter theatres that showcase this movie
        const movieTheatres = cityTheatres.filter((t) => {
          // If database IDs match
          return t.movies.includes(id) || t.movies.some(mId => mId.toString() === id.toString()) || t._id.startsWith("t"); 
        });

        setTheatres(movieTheatres);

        // Fetch shows for each matched theatre
        const showMap = {};
        await Promise.all(
          movieTheatres.map(async (theatre) => {
            const shows = await showService.getShows(theatre._id, id);
            showMap[theatre._id] = shows;
          })
        );
        setTheatreShows(showMap);
      } catch (err) {
        console.error("Failed to load theatres or shows", err);
      } finally {
        setLoading(false);
      }
    };
    loadTheatresAndShows();
  }, [id, selectedCity]);

  const handleShowClick = (theatre, show) => {
    selectTheatreAndShow(theatre, show);
    navigate(`/show/${show._id}`);
  };

  // Mock Date Picker (Today, Tomorrow, Day After)
  const getDates = () => {
    const list = [];
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      list.push({
        dayName: days[date.getDay()],
        dateNum: date.getDate(),
        monthName: months[date.getMonth()],
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : ""
      });
    }
    return list;
  };
  
  const dates = getDates();

  // Helper to categorize show timings
  const getTimingCategory = (timing) => {
    const hour = parseInt(timing.split(":")[0]);
    const period = timing.split(" ")[1]?.toUpperCase();

    if (period === "AM") return "Morning";
    if (period === "PM") {
      if (hour === 12 || hour < 4) return "Afternoon";
      if (hour >= 4 && hour < 8) return "Evening";
      return "Night";
    }
    return "Afternoon";
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  const movieName = movie?.name || "Selected Movie";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Movie Banner Header */}
      <header className="bg-slate-900 text-white py-6 border-b border-slate-850 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{movieName}</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>{movie?.language || "Hindi"}</span>
              <span>•</span>
              <span>{movie?.genre || "Action, Drama"}</span>
              <span>•</span>
              <span className="text-primary">{selectedCity}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Date Selector bar */}
      <div className="w-full bg-white dark:bg-dark-card border-b border-slate-200/50 dark:border-slate-800/40 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {dates.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDateIdx(idx)}
              className={`flex flex-col items-center p-2.5 min-w-[70px] rounded-xl border transition-all text-xs font-bold ${
                selectedDateIdx === idx
                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>{d.dayName}</span>
              <span className="text-lg font-black my-0.5">{d.dateNum}</span>
              <span>{d.monthName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Theatres list */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {theatres.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl p-8 border border-slate-250/50 dark:border-slate-850">
            <p className="text-slate-500 font-bold">No theatres currently scheduled for this movie.</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your location/city from the navigation bar.</p>
            <button onClick={() => navigate("/")} className="mt-6 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-md shadow-primary/10">
              Return to Home
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {theatres.map((theatre) => {
              const shows = theatreShows[theatre._id] || [];
              
              // Group shows by slots
              const slots = {
                Morning: shows.filter(s => getTimingCategory(s.timing) === "Morning"),
                Afternoon: shows.filter(s => getTimingCategory(s.timing) === "Afternoon"),
                Evening: shows.filter(s => getTimingCategory(s.timing) === "Evening"),
                Night: shows.filter(s => getTimingCategory(s.timing) === "Night")
              };

              const distance = (2.1 + (theatre._id.charCodeAt(theatre._id.length - 1) % 5) * 1.3).toFixed(1);

              return (
                <div 
                  key={theatre._id}
                  className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-xs flex flex-col lg:flex-row justify-between gap-4 sm:gap-6"
                >
                  {/* Left Column: Theatre metadata */}
                  <div className="lg:w-1/3 text-left space-y-3">
                    <div>
                      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                        {theatre.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                        {theatre.address}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/50 text-[10px] text-slate-500 font-bold border border-slate-200/10 flex items-center gap-1">
                        <Compass className="h-3 w-3 text-primary" /> {distance} km away
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/50 text-[10px] text-slate-500 font-bold border border-slate-200/10 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-green-500" /> COVID Safe
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {theatre.facilities?.slice(0, 3).map((facility) => (
                        <span key={facility} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                      
                  {/* Right Column: Showtime Slots Grid */}
                  <div className="flex-grow lg:w-2/3 space-y-4">
                    {shows.length === 0 ? (
                      <p className="text-slate-400 text-xs py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        No shows scheduled for today.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(slots).map(([slotName, slotShows]) => {
                          if (slotShows.length === 0) return null;
                          return (
                            <div key={slotName} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2 text-left border border-slate-100 dark:border-slate-850">
                              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                {slotName}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {slotShows.map((show) => {
                                  const seats = show.noOfSeats ?? 0;
                                  const isSoldOut = seats <= 0;
                                  const isFastFilling = seats > 0 && seats < 10;
                                  const seatColor = isSoldOut
                                    ? "text-slate-400"
                                    : seats > 30
                                    ? "text-emerald-500"
                                    : seats >= 10
                                    ? "text-orange-400"
                                    : "text-red-500";

                                  return (
                                  <button
                                    key={show._id}
                                    onClick={() => !isSoldOut && handleShowClick(theatre, show)}
                                    disabled={isSoldOut}
                                    className={`px-3.5 py-2 rounded-lg border text-xs font-extrabold text-left transition-all shadow-xs
                                      ${isSoldOut
                                        ? "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 text-slate-400 opacity-50 cursor-not-allowed"
                                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-card hover:bg-primary hover:border-primary dark:hover:bg-primary dark:hover:border-primary hover:text-white text-slate-750 dark:text-slate-200 cursor-pointer transform hover:scale-[1.03]"
                                      }`}
                                  >
                                    <div className="text-center">
                                      <div>{show.timing}</div>
                                      <div className="text-[9px] text-emerald-500 font-bold mt-0.5">
                                        ₹{show.ticketPrice ?? show.price}
                                      </div>
                                      <div className={`text-[9px] font-black mt-1 whitespace-nowrap ${isSoldOut ? "text-slate-400" : seatColor}`}>
                                        {isSoldOut
                                          ? "🚫 Sold Out"
                                          : isFastFilling
                                          ? `🔥 Only ${seats} Left`
                                          : `🎟 ${seats} Seats Left`}
                                      </div>
                                    </div>
                                  </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TheatreSelection;
