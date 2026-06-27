import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, MapPin, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../contexts/MovieContext";
import { showService } from "../services/showService";
import { theatreService } from "../services/theatreService";

function HeroCarousel() {
  const { movies, loading: moviesLoading, error: moviesError, refreshMovies } = useMovies();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [movieTheatres, setMovieTheatres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (moviesLoading) return;
      if (moviesError) {
        setError("Unable to load featured movies.");
        setLoading(false);
        return;
      }
      
      try {
        const released = movies.filter(m => m.releaseStatus === "RELEASED" || m.movieStatus === "RELEASED" || m.status === "RELEASED" || !m.releaseStatus); // Fallback if status not strictly enforced
        // If none released, just fallback to any movies
        const activeMovies = released.length > 0 ? released : movies.slice(0, 5);
        const topFeatured = activeMovies.slice(0, 5);
        
        if (topFeatured.length > 0) {
          // Attempt to fetch theatres and shows safely
          let allShows = [];
          let allTheatres = [];
          
          try {
            allShows = await showService.getShows() || [];
            allTheatres = await theatreService.getTheatres() || [];
          } catch (e) {
            console.warn("Failed to load shows/theatres for hero banner", e);
          }
          
          const theatresMap = {};
          
          topFeatured.forEach(movie => {
            const movieShows = allShows.filter(s => s.movieId === movie._id);
            const theatreIds = [...new Set(movieShows.map(s => s.theatreId))];
            
            const theatres = theatreIds.map(tid => {
              const t = allTheatres.find(th => th._id === tid);
              return t ? t.name : null;
            }).filter(Boolean);
            
            theatresMap[movie._id] = theatres;
          });
          
          setMovieTheatres(theatresMap);
        }
        
        setFeaturedMovies(topFeatured);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch featured movies data", err);
        setError("Unable to load featured movies.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [movies, moviesLoading, moviesError]);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [index, featuredMovies]);

  const handleNext = () => {
    if (featuredMovies.length === 0) return;
    setIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handlePrev = () => {
    if (featuredMovies.length === 0) return;
    setIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleRetry = () => {
    setLoading(true);
    refreshMovies();
  };

  if (loading || moviesLoading) {
    return (
      <div className="w-full h-[320px] md:h-[480px] bg-slate-900 animate-pulse flex items-center justify-center">
        <div className="text-slate-600 font-bold flex flex-col items-center gap-2">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-slate-400 rounded-full animate-spin"></div>
          Loading Featured Movies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[320px] md:h-[480px] bg-slate-900 flex flex-col items-center justify-center text-slate-300">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{error}</h2>
        <button 
          onClick={handleRetry}
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (featuredMovies.length === 0) {
    return (
      <div className="w-full h-[320px] md:h-[480px] bg-slate-900 flex items-center justify-center text-slate-400">
        <h2 className="text-xl font-bold">No movies currently featured</h2>
      </div>
    );
  }

  const currentMovie = featuredMovies[index];
  const theatres = movieTheatres[currentMovie._id] || [];
  const backgroundImageUrl = currentMovie.backdropUrl || currentMovie.posterUrl || currentMovie.imageUrl;

  return (
    <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden bg-slate-950">
      
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie._id}
          initial={{ opacity: 0.8, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Backdrop Image & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent z-10" />
          <img
            src={backgroundImageUrl}
            alt={currentMovie.name}
            className="w-full h-full object-cover object-top opacity-60"
          />

          {/* Banner Contents */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-full px-12 sm:px-16 flex justify-center">
              <div className="max-w-2xl w-full flex flex-col items-center text-center text-white space-y-4 sm:space-y-6 bg-slate-950/60 p-6 sm:p-10 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
                
                <div className="flex flex-wrap justify-center gap-2">
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md text-primary font-bold text-xs rounded-full uppercase tracking-wider border border-primary/30"
                  >
                    {currentMovie.genre || "FEATURED"}
                  </motion.span>
                  {currentMovie.language && (
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white font-bold text-xs rounded-full uppercase tracking-wider border border-white/20"
                    >
                      {currentMovie.language}
                    </motion.span>
                  )}
                  {currentMovie.rating && (
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="inline-block px-3 py-1 bg-yellow-500/20 backdrop-blur-md text-yellow-400 font-bold text-xs rounded-full uppercase tracking-wider border border-yellow-500/30"
                    >
                      ★ {currentMovie.rating}
                    </motion.span>
                  )}
                </div>
                
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg text-white"
                >
                  {currentMovie.name}
                </motion.h1>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:block text-sm sm:text-base text-slate-300 max-w-lg line-clamp-3 leading-relaxed"
                >
                  {currentMovie.description}
                </motion.p>

                {theatres.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Now Showing In
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {theatres.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-xs font-semibold text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                          {t}
                        </span>
                      ))}
                      {theatres.length > 3 && (
                        <span className="text-xs font-semibold text-slate-400 px-2 py-1">
                          +{theatres.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => navigate(`/movie/${currentMovie._id}`)}
                    className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-black text-sm sm:text-base rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(248,68,100,0.4)] hover:shadow-[0_0_30px_rgba(248,68,100,0.6)] transform hover:-translate-y-1"
                  >
                    <Play className="h-5 w-5 fill-white" />
                    Book Tickets
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 sm:left-8 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 hover:border-white/40 backdrop-blur-md transition-all shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 sm:right-8 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 hover:border-white/40 backdrop-blur-md transition-all shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {featuredMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-primary shadow-[0_0_10px_rgba(248,68,100,0.8)]" : "w-2 bg-white/40 hover:bg-white/60"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroCarousel;
