import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BANNER_ITEMS = [
  {
    id: "m1",
    title: "Deadpool & Wolverine",
    tagline: "The Ultimate Cinematic Duo Reunited",
    genre: "Action • Comedy • Sci-Fi",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
    description: "Witness the clash of claw and wit. Booking open across all screens.",
    cta: "Book Tickets"
  },
  {
    id: "m2",
    title: "Inside Out 2",
    tagline: "Make Room For New Emotions!",
    genre: "Animation • Comedy • Family",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
    description: "The blockbuster family movie of the year is now playing in IMAX 3D.",
    cta: "Book Tickets"
  },
  {
    id: "promo1",
    title: "Flat 50% Off on Second Ticket",
    tagline: "Exclusive CinePass Premium Offer",
    genre: "Promo Offer",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
    description: "Use code CINEPASS50 on UPI payments. Maximum discount ₹150.",
    cta: "View Offers"
  }
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % BANNER_ITEMS.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + BANNER_ITEMS.length) % BANNER_ITEMS.length);
  };

  const handleCtaClick = (item) => {
    if (item.id.startsWith("m")) {
      navigate(`/movie/${item.id}`);
    } else {
      // Direct to generic offers
      alert("Offer CINEPASS50 applied! Select a movie to book tickets.");
    }
  };

  return (
    <div className="relative w-full h-[320px] md:h-[480px] overflow-hidden bg-slate-950">
      
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.6 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Backdrop Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 z-10" />
          <img
            src={BANNER_ITEMS[index].image}
            alt={BANNER_ITEMS[index].title}
            className="w-full h-full object-cover object-center opacity-70"
          />

          {/* Banner Contents */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-left text-white space-y-3 sm:space-y-4">
                
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md text-primary font-bold text-xs rounded-full uppercase tracking-wider border border-primary/30"
                >
                  {BANNER_ITEMS[index].genre}
                </motion.span>
                
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-lg"
                >
                  {BANNER_ITEMS[index].title}
                </motion.h1>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg font-medium text-slate-350 text-slate-200 drop-shadow-md"
                >
                  {BANNER_ITEMS[index].tagline}
                </motion.p>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="hidden sm:block text-sm text-slate-400 max-w-lg"
                >
                  {BANNER_ITEMS[index].description}
                </motion.p>

                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => handleCtaClick(BANNER_ITEMS[index])}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-primary/30 transform hover:-translate-y-0.5"
                  >
                    {BANNER_ITEMS[index].id.startsWith("m") && <Play className="h-4 w-4 fill-white" />}
                    {BANNER_ITEMS[index].cta}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {BANNER_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-primary" : "w-2.5 bg-slate-500/70"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
