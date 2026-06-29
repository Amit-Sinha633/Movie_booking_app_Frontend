import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MovieProvider } from "./contexts/MovieContext";
import { BookingProvider } from "./contexts/BookingContext";

// Pages (Lazy Loaded)
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const TheatreSelection = lazy(() => import("./pages/TheatreSelection"));
const SeatSelection = lazy(() => import("./pages/SeatSelection"));
const BookingSummary = lazy(() => import("./pages/BookingSummary"));
const Payment = lazy(() => import("./pages/Payment"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));

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

              <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-white text-xl">Loading...</div>}>
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
                  <Route 
                    path="/client" 
                    element={
                      <ProtectedRoute>
                        <ClientDashboard />
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 Fallback redirection */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>

            </BookingProvider>
          </MovieProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
