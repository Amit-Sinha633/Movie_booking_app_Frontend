import React from "react";
import MovieBannerCard from "./MovieBannerCard";
import { ChevronRight } from "lucide-react";

function MovieSection({ title, movies = [] }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <button className="text-primary hover:text-rose-600 text-xs sm:text-sm font-bold flex items-center transition-colors">
            See All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Responsive Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-6">
          {movies.slice(0, 12).map((movie) => (
            <MovieBannerCard 
              key={movie._id} 
              movie={movie}
              compact={true}
              className="h-[280px] sm:h-[350px]" 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieSection;
