import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/movieService";
import { useBooking } from "../contexts/BookingContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { Star, Heart, Calendar, Clock, Play, User, Film, ChevronRight } from "lucide-react";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const loadMovieDetails = async () => {
      setLoading(true);
      try {
        const data = await movieService.getMovie(id);
        setMovie(data);
      } catch (err) {
        console.error("Error loading movie details", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovieDetails();
  }, [id]);

  const handleBookTickets = () => {
    if (!movie) return;
    startBooking(movie);
    navigate(`/movie/${movie._id}/theatres`);
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-500 font-bold text-lg">Movie not found</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-primary text-white rounded font-bold">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Cast mock avatars since database does not specify pictures
  const mockAvatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Cinematic Backdrop Section */}
      <div className="relative w-full h-[280px] sm:h-[420px] bg-black overflow-hidden select-none">
        
        {/* Blurred background image for full coverage */}
        <img
          src={movie.backdropUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105 opacity-30"
        />

        {/* Crisp cinematic banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-black/60 z-10" />
        <img
          src={movie.backdropUrl}
          alt={movie.name}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
        />

        {/* Trailer Trigger Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button
            onClick={() => setShowTrailer(true)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/95 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-primary/30 border-2 border-white/20 cursor-pointer"
            title="Watch Trailer"
          >
            <Play className="h-8 w-8 fill-white ml-1.5" />
          </button>
        </div>
      </div>

      {/* Movie Information & Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-24 sm:-mt-40 z-20 relative pb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Movie Poster Card (Overlaying) */}
          <div className="w-48 sm:w-64 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border-4 border-white dark:border-slate-900">
            <img
              src={movie.posterUrl}
              alt={movie.name}
              className="w-full object-cover aspect-[2/3]"
            />
          </div>

          {/* Details Column */}
          <div className="flex-grow space-y-6 text-left text-slate-800 dark:text-slate-100">
            
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                  {movie.releaseStatus}
                </span>
                {movie.format && movie.format.split(",").map((f) => (
                  <span key={f} className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-bold text-[10px] text-slate-600 dark:text-slate-400">
                    {f.trim()}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                {movie.name}
              </h1>

              {/* Likes/Ratings Row */}
              <div className="flex items-center gap-4 py-2 border-b border-slate-200/50 dark:border-slate-850 max-w-md">
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-black">{movie.rating > 0 ? movie.rating.toFixed(1) : "N/A"}</span>
                  <span className="text-xs text-slate-400">/10</span>
                </div>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />
                <div className="flex items-center gap-1.5 text-rose-500">
                  <Heart className="h-5 w-5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span className="text-sm font-bold text-slate-850 dark:text-slate-200">{movie.likesPercent}% likes</span>
                </div>
              </div>
            </div>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-450">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" /> {movie.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Film className="h-4 w-4 text-slate-400" /> {movie.language}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" /> {new Date(movie.releaseDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>

            {/* Book Tickets Action */}
            <button
              onClick={handleBookTickets}
              className="px-8 py-3.5 bg-primary hover:bg-primary/95 text-white font-extrabold text-base rounded-xl transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Book Tickets
            </button>

            {/* About Movie */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                About the Movie
              </h2>
              <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                {movie.description}
              </p>
            </div>

            {/* Cast & Crew Section */}
            <div className="space-y-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
              
              {/* Cast */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
                  Top Cast
                </h3>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {movie.casts?.map((actor, idx) => (
                    <div key={actor} className="flex items-center gap-3">
                      <img
                        src={mockAvatars[idx % mockAvatars.length]}
                        alt={actor}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow"
                      />
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{actor}</p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500">Actor</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
                  Crew
                </h3>
                <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{movie.director}</p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500">Director</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* YouTube Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-6 text-white hover:text-primary font-bold text-lg cursor-pointer"
          >
            Close ✕
          </button>
          
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 animate-scale-up">
            <iframe
              src={movie.trailerUrl.includes("embed") ? movie.trailerUrl : "https://www.youtube.com/embed/cbwK_3P6f38"}
              title={`${movie.name} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MovieDetails;
