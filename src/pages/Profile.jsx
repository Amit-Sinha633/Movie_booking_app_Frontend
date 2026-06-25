import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { bookingService } from "../services/bookingService";
import { movieService } from "../services/movieService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { Ticket, User, Heart, Settings, Calendar, MapPin, QrCode, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState([]);

  // Form states for account details
  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setBookingsLoading(true);
      try {
        const history = await bookingService.getMyBookings();
        setBookings(history);
        
        // Fetch mock wishlisted movies
        const list = await movieService.getMovies();
        setSavedMovies(list.slice(0, 2));
      } catch (err) {
        console.error("Failed to load profile bookings", err);
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (!name) return;
    setSavingSettings(true);
    setTimeout(() => {
      updateProfile({ ...user, name });
      toast.success("Name updated successfully!");
      setSavingSettings(false);
    }, 800);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    setSavingSettings(true);
    try {
      await authService.resetPassword({ oldPassword, newPassword });
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      const errMsg = error?.err || error?.message || "Failed to update password. Check your current password.";
      toast.error(errMsg);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-left">
        
        {/* Layout grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          
          {/* Sidebar Tabs — vertical on md+, horizontal scroll on mobile */}
          <div className="space-y-3 md:space-y-4">
            
            {/* User card info */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-sm text-center space-y-2">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xl sm:text-2xl mx-auto">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm sm:text-base">{user?.name || "Customer"}</h3>
                <p className="text-xs text-slate-450 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Menu options — horizontal scroll on mobile, vertical on md+ */}
            <div className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                  activeTab === "bookings"
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-655 dark:text-slate-400"
                }`}
              >
                <Ticket className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                  activeTab === "wishlist"
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-655 dark:text-slate-400"
                }`}
              >
                <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                  activeTab === "settings"
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-655 dark:text-slate-400"
                }`}
              >
                <Settings className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                Settings
              </button>
            </div>

          </div>

          {/* Main Dashboard Details display */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {/* MY BOOKINGS TAB */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <Ticket className="h-5.5 w-5.5 text-primary" />
                    My Bookings History
                  </h2>

                  {bookingsLoading ? (
                    <LoadingSpinner />
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-semibold space-y-1">
                      <p>You haven't booked any tickets yet.</p>
                      <p className="text-xs">Your purchase history will be listed here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {bookings.map((booking) => {
                        const isSuccess = booking.status === "SUCCESSFULL";
                        return (
                          <div 
                            key={booking._id} 
                            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
                          >
                            {/* Card Header info */}
                            <div className="bg-slate-900 dark:bg-slate-950 p-4 text-white flex flex-wrap justify-between items-center gap-3 text-left">
                              <div>
                                <h3 className="font-bold text-base sm:text-lg">{booking.movieName || "Movie"}</h3>
                                <p className="text-xs text-slate-400">{booking.theatreName || "Theatre"}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isSuccess ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                              }`}>
                                {booking.status}
                              </span>
                            </div>

                            {/* Card Info details */}
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Date & Time</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{booking.timing}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Seats Booked</p>
                                <p className="font-extrabold text-primary mt-0.5">{booking.seats?.join(", ") || `${booking.noOfSeats} Seats`}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Paid</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">₹{booking.totalCosts}</p>
                              </div>
                              <div className="flex justify-end items-center">
                                <QrCode className="h-10 w-10 text-slate-900 bg-white p-1 rounded-lg border" />
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <Heart className="h-5.5 w-5.5 text-primary" />
                    My Saved Movies Wishlist
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {savedMovies.map((movie) => (
                      <div key={movie._id} className="group block text-left bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                        <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-900 shadow">
                          <img src={movie.posterUrl} alt={movie.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-2 truncate">{movie.name}</h4>
                        <span className="text-[10px] font-bold text-primary">{movie.genre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACCOUNT SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="space-y-8">
                  
                  {/* Name settings */}
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <User className="h-5.5 w-5.5 text-primary" />
                      Account Settings
                    </h2>

                    <form onSubmit={handleUpdateName} className="space-y-4 max-w-md">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
                          User Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full px-3.5 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={savingSettings}
                        className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg transition-all"
                      >
                        {savingSettings ? "Saving..." : "Update Name"}
                      </button>
                    </form>
                  </div>

                  {/* Password settings */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Lock className="h-4.5 w-4.5 text-primary" />
                      Reset Password Settings
                    </h3>

                    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider block">
                          Current Password
                        </label>
                        <input
                          type="password"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="block w-full px-3.5 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider block">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full px-3.5 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={savingSettings}
                        className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg transition-all"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
