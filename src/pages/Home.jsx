import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import MovieSection from "../components/MovieSection";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useMovies } from "../contexts/MovieContext";
import { theatreService } from "../services/theatreService";
import { Film, MapPin, Ticket, Award, Calendar, Sparkles } from "lucide-react";

// Mock events for landing page richness
const MOCK_EVENTS = [
  {
    id: "e1",
    title: "Comic Con India 2026",
    type: "Pop Culture Event",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=60",
    date: "July 12-14",
    price: "From ₹899"
  },
  {
    id: "e2",
    title: "A.R. Rahman Live Concert",
    type: "Music Concert",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=60",
    date: "August 05",
    price: "From ₹1500"
  },
  {
    id: "e3",
    title: "Sunburn Festival Goa",
    type: "EDM Festival",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=60",
    date: "December 27-30",
    price: "From ₹3000"
  },
  {
    id: "e4",
    title: "Mughal-E-Azam: The Musical",
    type: "Theatre Play",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60",
    date: "July 20-25",
    price: "From ₹500"
  }
];

function Home() {
  const { filteredMovies, loading, error, selectedCity } = useMovies();
  const [theatres, setTheatres] = useState([]);
  const [theatresLoading, setTheatresLoading] = useState(false);

  useEffect(() => {
    const fetchCityTheatres = async () => {
      setTheatresLoading(true);
      try {
        const data = await theatreService.getTheatres(selectedCity);
        setTheatres(data);
      } catch (err) {
        console.error("Failed to load theatres for city:", selectedCity, err);
      } finally {
        setTheatresLoading(false);
      }
    };
    fetchCityTheatres();
  }, [selectedCity]);

  // Filter movies into Now Showing and Upcoming
  const nowShowingMovies = filteredMovies.filter(
    (movie) => movie.releaseStatus?.toLowerCase() === "released"
  );
  
  const upcomingMovies = filteredMovies.filter(
    (movie) => movie.releaseStatus?.toLowerCase() === "upcoming"
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <HeroBanner />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 font-bold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded font-semibold text-sm"
          >
            Retry
          </button>
        </div>
      ) : (
        <main className="flex-grow pb-16">
          
          {/* 1. Recommended Movies (Horizontal Scroll / Top Row) */}
          <MovieSection 
            title="Recommended Movies" 
            movies={nowShowingMovies} 
          />

          {/* Promotional Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
            <div className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-primary p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-md">
              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="h-5 w-5 animate-pulse text-amber-300 fill-amber-300" />
                  UPTO ₹150 OFF ON UPI PAYMENTS
                </h3>
                <p className="text-xs sm:text-sm text-rose-100 font-medium">
                  Use CinePass checkout with UPI to save on your favorite blockbusters. Standard terms apply.
                </p>
              </div>
              <button className="px-6 py-3 bg-white hover:bg-slate-150 text-primary font-extrabold text-sm rounded-xl transition-all shadow-md flex-shrink-0 cursor-pointer">
                Select Movie
              </button>
            </div>
          </div>

          {/* 2. Now Showing Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200/40 dark:border-slate-800/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Now Showing in <span className="text-primary">{selectedCity}</span>
              </h2>
            </div>
            
            {nowShowingMovies.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No movies currently showing in this city.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {nowShowingMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}
          </div>

          {/* 3. Upcoming Movies Grid */}
          {upcomingMovies.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200/40 dark:border-slate-800/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Upcoming Movies
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {upcomingMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {/* 4. Popular Events Slider */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200/40 dark:border-slate-800/30">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
              <Calendar className="h-5.5 w-5.5 text-primary" />
              Popular Live Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {MOCK_EVENTS.map((event) => (
                <div key={event.id} className="group rounded-xl overflow-hidden bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{event.type}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{event.title}</h3>
                    <div className="flex justify-between text-xs text-slate-500 font-semibold pt-1">
                      <span>{event.date}</span>
                      <span className="text-slate-700 dark:text-slate-350">{event.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Recommended Theatres Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200/40 dark:border-slate-800/30">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
              <Ticket className="h-5.5 w-5.5 text-primary" />
              Popular Theatres in {selectedCity}
            </h2>
            
            {theatresLoading ? (
              <div className="py-6"><LoadingSpinner /></div>
            ) : theatres.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No theatres registered in this city.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {theatres.map((theatre) => (
                  <div 
                    key={theatre._id} 
                    className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-sm space-y-4 text-left transition-all hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-1.5">
                        <MapPin className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                        {theatre.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 pl-6 line-clamp-1">
                        {theatre.address}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pl-6">
                      {theatre.facilities?.map((facility) => (
                        <span 
                          key={facility} 
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/50 text-[10px] text-slate-550 dark:text-slate-400 font-bold border border-slate-200/20 dark:border-slate-700/20"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      )}

      <Footer />
    </div>
  );
}

export default Home;