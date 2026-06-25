import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";

function MovieCard({ movie }) {
  const { _id, name, posterUrl, genre, rating, likesPercent, language, format } = movie;

  return (
    <Link to={`/movie/${_id}`} className="group block">
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-900 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 border border-slate-200/10 dark:border-slate-800/10">
        
        {/* Movie Poster Image */}
        <img
          src={posterUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rating/Like Overlay Ribbon (similar to BookMyShow's black pill at bottom of poster) */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs py-2 px-3 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-rose-500">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span className="text-white text-[10px]">{likesPercent}% likes</span>
          </div>
        </div>

        {/* Format / Language Pill (top left) */}
        {format && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
            {format.split(",")[0]}
          </div>
        )}
      </div>

      {/* Movie Details Text */}
      <div className="mt-3 space-y-0.5">
        <h3 className="font-bold text-slate-850 dark:text-slate-100 text-base group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">{language}</span>
          <span className="text-slate-350 dark:text-slate-700">•</span>
          <span className="truncate">{genre}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;