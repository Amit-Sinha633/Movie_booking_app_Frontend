import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);


  const startBooking = (movie) => {
    setSelectedMovie(movie);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setTicketQuantity(1);
  };

  const selectTheatreAndShow = (theatre, show) => {
    setSelectedTheatre(theatre);
    setSelectedShow(show);
    setTicketQuantity(1);
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setTicketQuantity(1);
  };

  const getSubtotal = () => {
    if (!selectedShow) return 0;
    const basePrice = selectedShow.price || 300;
    return ticketQuantity * basePrice;
  };

  const getTotalPrice = () => {
    return getSubtotal();
  };

  const value = {
    selectedMovie,
    selectedTheatre,
    selectedShow,
    ticketQuantity,
    setTicketQuantity,
    setSelectedMovie,
    setSelectedTheatre,
    setSelectedShow,
    startBooking,
    selectTheatreAndShow,
    clearBooking,
    subtotal: getSubtotal(),
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
