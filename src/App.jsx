import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MovieProvider } from "./contexts/MovieContext";
import { BookingProvider } from "./contexts/BookingContext";

// Pages
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import TheatreSelection from "./pages/TheatreSelection";
import SeatSelection from "./pages/SeatSelection";
import BookingSummary from "./pages/BookingSummary";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

// Protective Wrappers
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MovieProvider>
            <BookingProvider>
              
              {/* Notification bubble alerts */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "14px"
                  }
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/movie/:id/theatres" element={<TheatreSelection />} />
                <Route path="/show/:showId" element={<SeatSelection />} />
                <Route path="/booking/:bookingId" element={<BookingSummary />} />
                <Route path="/payment/:bookingId" element={<Payment />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Account Routes (Protected) */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Management Dashboard (Protected & Role Restrained) */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Fallback redirection */}
                <Route path="*" element={<Home />} />
              </Routes>

            </BookingProvider>
          </MovieProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
