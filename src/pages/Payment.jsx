import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import { paymentService } from "../services/paymentService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { CreditCard, Wallet, Landmark, PhoneCall, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Retrieve final bill from location state, fallback to 0
  const finalAmount = location.state?.finalAmount || 0;

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        if (location.state?.booking) {
          setBooking(location.state.booking);
          setLoading(false);
          return;
        }
        const data = await bookingService.getBooking(bookingId);
        setBooking(data);
      } catch (err) {
        toast.error("Failed to load booking information.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      // 1. Trigger payment API creation
      // Expects: bookingId, amount, showId
      const showId = booking.showId || `s_${booking.theatreId}_${booking.movieId}_0`;
      const amount = finalAmount || booking.totalCosts;
      
      const paymentResponse = await paymentService.createPayment(bookingId, amount, showId);
      
      // 2. Set booking status to SUCCESSFULL
      // await bookingService.updateBookingStatus(bookingId, "SUCCESSFULL");
      
      // 3. Show Success Modal
      setPaying(false);
      setShowSuccessModal(true);
    } catch (err) {
      toast.error("Payment failed. Please check balance or try another method.");
      setPaying(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Navigate to booking success page with state details
    navigate("/booking-success", { state: { bookingId, booking } });
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 font-bold">Booking not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const invoiceAmount = finalAmount || booking.totalCosts;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full text-left">
        
        {paying ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold">Processing Secure Payment...</h2>
            <p className="text-sm text-slate-400">Do not refresh this page or click back button.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Right Column: Checkout Invoice Summary Card — shown first on mobile */}
            <div className="space-y-4 lg:order-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Order Summary
              </h2>

              <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 p-4 sm:p-6 shadow-md space-y-4 sm:space-y-6 text-sm">
                
                <div>
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-base sm:text-lg line-clamp-1">{booking.movieName || "Movie"}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{booking.theatreName || "Theatre"}</p>
                  <p className="text-slate-550 dark:text-slate-350 text-xs font-semibold mt-1">Showtime: {booking.timing}</p>
                </div>

                <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4 space-y-2.5">
                  <div className="flex justify-between font-medium text-slate-500">
                    <span>Seats ({booking.noOfSeats})</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {booking.seats?.join(", ") || "Seats Selected"}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-500">
                    <span>Amount Payable</span>
                    <span className="font-bold text-slate-800 dark:text-white">₹{invoiceAmount}</span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePayment}
                  className="w-full py-3 sm:py-3.5 bg-primary hover:bg-primary/95 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Pay ₹{invoiceAmount} Now
                </button>
              </div>
            </div>

            {/* Left Column: Payment Methods Selection */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:order-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Select Payment Method
              </h1>

              <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-md divide-y divide-slate-100 dark:divide-slate-800">
                
                {/* UPI Option */}
                <label className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${selectedMethod === "upi" ? "bg-primary/5 dark:bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === "upi"}
                    onChange={() => setSelectedMethod("upi")}
                    className="accent-primary h-4 w-4"
                  />
                  <div className="p-2 sm:p-2.5 rounded-lg bg-rose-500/10 text-primary flex-shrink-0">
                    <PhoneCall className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">UPI / QR Code</p>
                    <p className="text-xs text-slate-450 dark:text-slate-400">Pay using Google Pay, PhonePe, Paytm, or BHIM.</p>
                  </div>
                </label>

                {/* Card Option */}
                <label className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${selectedMethod === "card" ? "bg-primary/5 dark:bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === "card"}
                    onChange={() => setSelectedMethod("card")}
                    className="accent-primary h-4 w-4"
                  />
                  <div className="p-2 sm:p-2.5 rounded-lg bg-blue-500/10 text-blue-600 flex-shrink-0">
                    <CreditCard className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">Credit / Debit Cards</p>
                    <p className="text-xs text-slate-455 dark:text-slate-400">Visa, Mastercard, RuPay, and Maestro accepted.</p>
                  </div>
                </label>

                {/* Net Banking Option */}
                <label className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${selectedMethod === "banking" ? "bg-primary/5 dark:bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === "banking"}
                    onChange={() => setSelectedMethod("banking")}
                    className="accent-primary h-4 w-4"
                  />
                  <div className="p-2 sm:p-2.5 rounded-lg bg-amber-500/10 text-amber-500 flex-shrink-0">
                    <Landmark className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">Net Banking</p>
                    <p className="text-xs text-slate-455 dark:text-slate-400">Secure direct transfer from major national banks.</p>
                  </div>
                </label>

                {/* Wallet Option */}
                <label className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${selectedMethod === "wallet" ? "bg-primary/5 dark:bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === "wallet"}
                    onChange={() => setSelectedMethod("wallet")}
                    className="accent-primary h-4 w-4"
                  />
                  <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 flex-shrink-0">
                    <Wallet className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">Mobile Wallets</p>
                    <p className="text-xs text-slate-455 dark:text-slate-400">Amazon Pay, Mobikwik, PhonePe Wallet.</p>
                  </div>
                </label>

              </div>
            </div>

          </div>
        )}
      </main>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 p-6 text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Payment Successful!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have received your payment of ₹{invoiceAmount}. Your tickets are confirmed. Let's print your voucher!
            </p>
            <button
              onClick={handleModalClose}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              Get Tickets
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Payment;
