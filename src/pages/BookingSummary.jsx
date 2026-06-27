import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { Ticket, CreditCard, Armchair, Percent, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

function BookingSummary() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        const data = await bookingService.getBooking(bookingId);
        setBooking(data);
      } catch (err) {
        toast.error("Failed to load booking details.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-red-500 font-bold">Booking session not found.</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-primary text-white rounded">
            Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate pricing from loaded booking details (protects state from refreshes)
  const ticketSubtotal = booking.totalCosts || 0;
  const totalBill = ticketSubtotal;

  const handleProceedToPayment = () => {
    // Navigate to payment page with matching total bill calculation
    navigate(`/payment/${bookingId}`, { state: { finalAmount: totalBill } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full text-left">
        <div className="space-y-6">
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            Booking Summary
          </h1>

          <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-md overflow-hidden">
            
            {/* Movie Title Banner */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center gap-4">
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Ticket Invoice</span>
                <h2 className="text-xl font-bold">{booking.movieName || "Movie"}</h2>
                <p className="text-xs text-slate-400">{booking.theatreName || "Theatre"}</p>
              </div>
              <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-bold text-slate-350">
                {booking.timing}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6">
              
              {/* Seats Info */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
                  <Armchair className="h-4 w-4 text-primary" />
                  <span>Seats Booked ({booking.noOfSeats})</span>
                </div>
                <div className="flex flex-wrap gap-1 font-bold text-slate-800 dark:text-white">
                  {booking.seats?.map((seat) => (
                    <span key={seat} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/10 text-xs">
                      {seat}
                    </span>
                  )) || <span className="text-xs font-bold text-slate-400">N/A</span>}
                </div>
              </div>

              {/* Bill Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Payment Breakdown</h3>

                <div className="space-y-2 text-sm">
                  
                  {/* Subtotal */}
                  <div className="flex justify-between font-medium text-slate-650 dark:text-slate-300">
                    <span>Ticket Price ({booking.noOfSeats} Seats)</span>
                    <span className="font-bold text-slate-800 dark:text-white">₹{ticketSubtotal}</span>
                  </div>



                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                  {/* Grand Total */}
                  <div className="flex justify-between items-center text-base font-bold text-slate-900 dark:text-white pt-1">
                    <span className="text-slate-850 dark:text-slate-205">Total Payable Amount</span>
                    <span className="text-2xl font-black text-primary">₹{totalBill}</span>
                  </div>

                </div>
              </div>

              {/* Secure Transaction badge */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-500">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Your booking transaction is encrypted and fully secure. Seats are locked for 5 minutes.</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-1/3 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-350 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Change Seats
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-2/3 py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="h-4.5 w-4.5" />
                  Proceed To Payment
                </button>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookingSummary;
