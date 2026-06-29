import React from "react";
import { motion } from "framer-motion";
import { Play, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MovieBannerCard({ movie, theatres = [], className = "", compact = false }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const backgroundImageUrl = movie.backdropUrl || movie.posterUrl;
  
  // A consistent premium gradient fallback when no image is available
  const gradientFallback = "bg-gradient-to-br from-slate-800 via-slate-900 to-black";

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 flex-shrink-0 shadow-lg border border-slate-800/50 transition-transform duration-300 hover:shadow-xl ${className || 'h-[350px] sm:h-[450px] md:h-[550px]'}`}>
      
      {/* Backdrop Image & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent z-10" />
      
      {backgroundImageUrl ? (
        <img
          src={backgroundImageUrl}
          alt={movie.name}
          className="w-full h-full object-cover object-top opacity-60 transition-transform duration-700 hover:scale-105"
        />
      ) : (
        <div className={`w-full h-full ${gradientFallback} opacity-80`} />
      )}

      {/* Banner Contents */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className={`w-full flex justify-center ${compact ? 'px-2 sm:px-4' : 'px-4 sm:px-8 lg:px-12'}`}>
          <div className="max-w-2xl w-full flex flex-col items-center text-center text-white space-y-3 sm:space-y-4">

            {/* Pill Badges Row: Genre | Language | Rating */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
            >
              {/* Genre Pill */}
              {movie.genre && (
                <span className={`rounded-full font-bold uppercase tracking-widest bg-[#0a0a0a]/80 border border-primary text-primary shadow-sm backdrop-blur-sm ${compact ? 'px-2 py-0.5 text-[9px] sm:text-[10px]' : 'px-3 sm:px-5 py-1 sm:py-1.5 text-[11px] sm:text-[13px]'}`}>
                  {movie.genre}
                </span>
              )}
              {/* Language Pill */}
              {movie.language && (
                <span className={`rounded-full font-bold uppercase tracking-widest bg-[#0a0a0a]/80 border border-slate-400 text-white shadow-sm backdrop-blur-sm ${compact ? 'px-2 py-0.5 text-[9px] sm:text-[10px]' : 'px-3 sm:px-5 py-1 sm:py-1.5 text-[11px] sm:text-[13px]'}`}>
                  {movie.language}
                </span>
              )}
              {/* Rating Pill */}
              {movie.rating > 0 && (
                <span className={`rounded-full font-bold uppercase tracking-widest bg-[#0a0a0a]/80 border border-amber-500 text-amber-500 flex items-center gap-1 shadow-sm backdrop-blur-sm ${compact ? 'px-2 py-0.5 text-[9px] sm:text-[10px]' : 'px-3 sm:px-5 py-1 sm:py-1.5 text-[11px] sm:text-[13px]'}`}>
                  ★ {Number(movie.rating).toFixed(1)}
                </span>
              )}
            </motion.div>

            {/* Movie Title */}
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`font-black tracking-tight drop-shadow-2xl leading-none line-clamp-2 px-1 ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl'}`}
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}
            >
              {movie.name}
            </motion.h3>

            {/* Description */}
            {movie.description && !compact && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="hidden sm:block text-xs sm:text-sm md:text-base text-slate-300 max-w-lg line-clamp-2 leading-relaxed px-4"
              >
                {movie.description}
              </motion.p>
            )}

            {/* Theatre Tags (optional) */}
            {theatres.length > 0 && !compact && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Now Showing In
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {theatres.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-xs font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
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

            {/* Book Tickets Button */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-2 sm:pt-4"
            >
              <button
                onClick={() => navigate(`/movie/${movie._id}`)}
                className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-black rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${compact ? 'px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm' : 'px-6 sm:px-10 py-2.5 sm:py-3.5 text-sm sm:text-[15px]'}`}
              >
                <Play className={`fill-white flex-shrink-0 ${compact ? 'h-3 w-3 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                Book Tickets
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieBannerCard;
