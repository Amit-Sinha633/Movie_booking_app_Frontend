import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import MovieSection from "../components/MovieSection";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { useMovies } from "../contexts/MovieContext";
import { theatreService } from "../services/theatreService";
import { showService } from "../services/showService";
import { Film, MapPin, Ticket, Award, Sparkles, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";



function Home() {
  const { filteredMovies, loading, error, selectedCity } = useMovies();
  const [theatres, setTheatres] = useState([]);
  const [theatresLoading, setTheatresLoading] = useState(false);
  const navigate = useNavigate();

  // Modal State
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [theatreShows, setTheatreShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(false);
  const [isShowsModalOpen, setIsShowsModalOpen] = useState(false);

  const handleViewShows = async (theatre) => {
    setSelectedTheatre(theatre);
    setIsShowsModalOpen(true);
    setShowsLoading(true);
    try {
      const shows = await showService.getShowsAvailableInTheatre(theatre._id);
      setTheatreShows(shows);
    } catch (err) {
      console.error("Failed to fetch shows", err);
      setTheatreShows([]);
    } finally {
      setShowsLoading(false);
    }
  };

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
          
          {/* Movies Content */}
          {filteredMovies.length === 0 ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <EmptyState title="No Movies Found" description="We couldn't find any movies matching your current filters." />
            </div>
          ) : (
            <>
              {/* 1. Recommended Movies */}
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
                </div>
              </div>

              {/* 2. Now Showing */}
              <MovieSection 
                title={`Now Showing in ${selectedCity}`} 
                movies={nowShowingMovies} 
              />

              {/* 3. Upcoming Movies */}
              <MovieSection 
                title="Upcoming Movies" 
                movies={upcomingMovies} 
              />
            </>
          )}



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
                    className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl overflow-hidden group hover:border-primary/40 transition-all duration-500 transform hover:-translate-y-1"
                  >
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 space-y-4">
                      <div>
                        <h3 className="font-black text-white text-lg sm:text-xl flex items-start gap-2.5 drop-shadow-md leading-tight">
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          {theatre.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1.5 pl-7.5 line-clamp-2 font-medium">
                          {theatre.address}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pl-7.5 pt-2">
                        {theatre.facilities?.map((facility) => (
                          <span 
                            key={facility} 
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] sm:text-xs text-slate-300 font-bold tracking-wide shadow-inner backdrop-blur-sm group-hover:border-white/20 transition-colors duration-300"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>

                      {/* Available Shows Button */}
                      <div className="pt-3">
                        <button 
                          onClick={() => handleViewShows(theatre)}
                          className="w-full py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold rounded-xl transition-colors duration-300 text-sm shadow-sm cursor-pointer"
                        >
                          Available Shows
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      )}

      <Footer />

      {/* Available Shows Modal */}
      {isShowsModalOpen && selectedTheatre && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Shows at {selectedTheatre.name}
              </h3>
              <button 
                onClick={() => setIsShowsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 sm:p-6 overflow-y-auto flex-grow bg-slate-900/50">
              {showsLoading ? (
                <div className="py-12 flex justify-center"><LoadingSpinner /></div>
              ) : theatreShows.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 font-medium mb-2">No shows currently available here.</p>
                  <p className="text-xs text-slate-500">Please check back later or try another theatre.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {theatreShows.map(show => (
                    <div key={show._id} className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/80 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white text-base sm:text-lg">{show.movie?.name || "Movie Name"}</h4>
                        <div className="flex gap-4 text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(show.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {show.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-[10px] sm:text-xs font-bold text-slate-300 border border-slate-600/50">
                          {show.format || "2D"}
                        </span>
                        <button 
                          onClick={() => {
                            setIsShowsModalOpen(false);
                            if (show.movie?._id) navigate(`/movie/${show.movie._id}`);
                          }}
                          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-sm transition-colors shadow-md cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;