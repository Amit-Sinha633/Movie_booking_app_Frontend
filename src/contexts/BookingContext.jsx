import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // Array of strings like "A-1", "B-5"
  const [convenienceFeePercent] = useState(0.10); // 10%
  const [gstPercent] = useState(0.18); // 18% GST

  const startBooking = (movie) => {
    setSelectedMovie(movie);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  const selectTheatreAndShow = (theatre, show) => {
    setSelectedTheatre(theatre);
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  // Compute pricing
  const getSeatPrice = (seatId) => {
    if (!selectedShow) return 0;
    const basePrice = selectedShow.price || 250;
    
    // Platinum: A, B (higher price)
    // Gold: C, D, E (base price)
    // Silver: F, G, H (lower price)
    const row = seatId.split("-")[0];
    if (row === "A" || row === "B") {
      return basePrice * 1.5; // Platinum
    } else if (row === "F" || row === "G" || row === "H") {
      return basePrice * 0.8; // Silver
    }
    return basePrice; // Gold
  };

  const getSubtotal = () => {
    return selectedSeats.reduce((sum, seatId) => sum + getSeatPrice(seatId), 0);
  };

  const getConvenienceFee = () => {
    return Math.round(getSubtotal() * convenienceFeePercent);
  };

  const getGst = () => {
    return Math.round(getConvenienceFee() * gstPercent);
  };

  const getTotalPrice = () => {
    return getSubtotal() + getConvenienceFee() + getGst();
  };

  const value = {
    selectedMovie,
    selectedTheatre,
    selectedShow,
    selectedSeats,
    setSelectedMovie,
    setSelectedTheatre,
    setSelectedShow,
    setSelectedSeats,
    startBooking,
    selectTheatreAndShow,
    toggleSeat,
    clearBooking,
    getSeatPrice,
    subtotal: getSubtotal(),
    convenienceFee: getConvenienceFee(),
    gst: getGst(),
    totalPrice: getTotalPrice()
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
