import React from "react";
import { Film } from "lucide-react";

function EmptyState({ title = "No Movies Available", description = "Check back later for new releases." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 dark:bg-dark-card/30 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Film className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
