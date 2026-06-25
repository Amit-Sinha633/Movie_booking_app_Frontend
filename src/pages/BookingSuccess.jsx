import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, Ticket, Printer, Share2, MapPin, Calendar, QrCode } from "lucide-react";
import { useBooking } from "../contexts/BookingContext";
import { toast } from "react-hot-toast";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearBooking } = useBooking();

  const bookingId = location.state?.bookingId || "b_mock_" + Math.random().toString(36).substr(2, 9);
  const booking = location.state?.booking || {
    movieName: "Deadpool & Wolverine",
    theatreName: "PVR Forum Mall, Kolkata",
    timing: "04:30 PM",
    noOfSeats: 2,
    seats: ["C-4", "C-5"],
    totalCosts: 500,
    createdAt: new Date().toISOString()
  };

  // Clear booking context so next movie starts fresh
  useEffect(() => {
    clearBooking();
  }, [clearBooking]);

  const handlePrint = () => {
    toast.success("Downloading PDF Ticket Voucher...");
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-xl mx-auto px-4 sm:px-6 py-12 w-full text-center space-y-6">
        
        {/* Success Banner */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2 border border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-slate-500">Your seat is reserved. Bring the QR code below to the box office.</p>
        </div>

        {/* Cinematic Ticket Voucher Card */}
        <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-xl overflow-hidden text-left relative">
          
          {/* Top segment */}
          <div className="p-6 bg-slate-900 text-white relative">
            
            {/* Dashed background layout block */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">CinePass Boarding Ticket</span>
              <h2 className="text-2xl font-black">{booking.movieName}</h2>
              <p className="text-xs text-slate-400 font-semibold">{booking.theatreName}</p>
            </div>

            {/* Movie icon decoration */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 opacity-20">
              <Ticket className="w-16 h-16" />
            </div>
          </div>

          {/* Ticket Body Detail Grid */}
          <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-6 border-b border-dashed border-slate-200/70 dark:border-slate-850">
            
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Time
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-205">{booking.timing}</p>
              <p className="text-[10px] text-slate-450">Today, {new Date(booking.createdAt).toLocaleDateString("en-IN")}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Seat Detail
              </p>
              <p className="text-sm font-black text-primary">
                {booking.seats?.join(", ") || `${booking.noOfSeats} Seats`}
              </p>
              <p className="text-[10px] text-slate-450">Regular Class</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking ID</p>
              <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{bookingId}</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Price</p>
              <p className="text-sm font-black text-slate-800 dark:text-white">₹{booking.totalCosts + Math.round(booking.totalCosts * 0.10) + Math.round(booking.totalCosts * 0.10 * 0.18)}</p>
            </div>

          </div>

          {/* Ticket Footer: QR Code Segment */}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Scan at Cinema Entrance</p>
              <p className="text-[10px] text-slate-500">Use kiosk to print physical tickets directly inside hall lobby.</p>
            </div>
            
            {/* Visual QR Code Placeholder */}
            <div className="p-2 bg-white rounded-xl border border-slate-200 dark:border-slate-850 flex items-center justify-center shadow-xs">
              <QrCode className="h-16 w-16 text-slate-900" />
            </div>
          </div>

        </div>

        {/* Quick actions panel */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={() => navigate("/")}
            className="w-1/2 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-250 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-200 font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            Go To Home
          </button>
          
          <button
            onClick={handlePrint}
            className="w-1/2 py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
          >
            <Printer className="h-4.5 w-4.5" />
            Download Ticket
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default BookingSuccess;
