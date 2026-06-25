import React from "react";

const LoadingSpinner = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wider animate-pulse">
        LOADING CINEMA...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{spinner}</div>;
};

export default LoadingSpinner;
