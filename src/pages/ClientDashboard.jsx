import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { movieService } from "../services/movieService";
import { theatreService } from "../services/theatreService";
import { showService } from "../services/showService";
import { bookingService } from "../services/bookingService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { Film, Ticket, Shield, Landmark, Plus, Trash2, Edit3, DollarSign, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";

function ClientDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showsError, setShowsError] = useState(false);

  // Data lists
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modals visibility
  const [movieModal, setMovieModal] = useState(false);
  const [theatreModal, setTheatreModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Edit contexts
  const [editItem, setEditItem] = useState(null);

  // Movie Form Fields
  const [movieForm, setMovieForm] = useState({
    name: "", description: "", casts: "", trailerUrl: "",
    language: "English", releaseDate: "", director: "", releaseStatus: "Released"
  });

  // Theatre Form Fields
  const [theatreForm, setTheatreForm] = useState({
    name: "", description: "", city: "Kolkata", pinCode: "", address: "", movies: []
  });

  // Show Form Fields
  const [showForm, setShowForm] = useState({
    theatreId: "", movieId: "", timing: "04:30 PM", noOfSeats: 120, price: 250, format: "2D"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const ml = await movieService.getMovies();
      setMovies(ml);
      const tl = await theatreService.getMyTheatres();
      setTheatres(tl);
      
      try {
        const sl = await showService.getMyShows();
        setShows(sl);
        setShowsError(false);
      } catch (err) {
        setShowsError(true);
        console.error("Failed to load client shows", err);
      }

      const bl = await bookingService.getMyBookings(); 
      setBookings(bl);
    } catch (e) {
      console.error("Failed to load client dashboard indices", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // CRUD Movie
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await movieService.updateMovie(editItem._id, movieForm);
        toast.success("Movie updated successfully!");
      } else {
        await movieService.createMovie(movieForm);
        toast.success("Movie created successfully!");
      }
      setMovieModal(false);
      setEditItem(null);
      loadData();
    } catch (err) {
      toast.error("Failed to submit movie details.");
    }
  };

  const handleMovieDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await movieService.deleteMovie(id);
      toast.success("Movie deleted!");
      loadData();
    } catch (err) {
      toast.error("Delete operation failed.");
    }
  };

  // CRUD Theatre
  const handleTheatreSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await theatreService.updateTheatre(editItem._id, theatreForm);
        toast.success("Theatre updated successfully!");
      } else {
        await theatreService.createTheatre(theatreForm);
        toast.success("Theatre registered successfully!");
      }
      setTheatreModal(false);
      setEditItem(null);
      loadData();
    } catch (err) {
      toast.error("Failed to save theatre.");
    }
  };

  const handleTheatreDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theatre?")) return;
    try {
      await theatreService.deleteTheatre(id);
      toast.success("Theatre deleted!");
      loadData();
    } catch (err) {
      toast.error("Delete operation failed.");
    }
  };

  // CRUD Show
  const handleShowSubmit = async (e) => {
    e.preventDefault();
    if (!showForm.movieId || !showForm.theatreId) {
      toast.error("Please select a movie and a theatre!");
      return;
    }
    try {
      if (editItem) {
        await showService.updateShow(editItem._id, showForm);
        toast.success("Show updated successfully!");
      } else {
        await showService.createShow(showForm);
        toast.success("Show created successfully!");
      }
      setShowModal(false);
      setEditItem(null);
      loadData();
    } catch (err) {
      toast.error("Failed to record show times.");
    }
  };

  const handleShowDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this showtimes?")) return;
    try {
      await showService.deleteShow(id);
      toast.success("Show deleted!");
      loadData();
    } catch (err) {
      toast.error("Delete operation failed.");
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Please log in to view your dashboard.</div>;
  }

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  const totalSpent = bookings
    .filter(b => b.status === "SUCCESSFULL" || b.status === "SUCCESS")
    .reduce((sum, b) => sum + (b.totalCosts || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Client Sidebar Navigation */}
          <div className="space-y-3 lg:space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-sm text-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg mx-auto">
                <UserCheck className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-3">{user?.name || "Client"}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 bg-blue-500/10 text-blue-500 inline-block px-2 py-0.5 rounded">
                CLIENT PORTAL
              </p>
            </div>

            <div className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {[
                { id: "dashboard", label: "Dashboard", icon: Shield },
                { id: "movies", label: "Movies", icon: Film },
                { id: "theatres", label: "My Theatres", icon: Landmark },
                { id: "shows", label: "Shows", icon: Ticket },
                { id: "bookings", label: "Bookings", icon: Ticket }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 p-2.5 lg:p-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-md shadow-primary/10"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-655 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Panels content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {/* 1. DASHBOARD HUB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-850 pb-4">
                    Client Dashboard
                  </h2>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Film className="h-5 w-5 text-primary" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Movies</p>
                      <p className="text-2xl font-black">{movies.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Landmark className="h-5 w-5 text-blue-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Theatres Owned</p>
                      <p className="text-2xl font-black">{theatres.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Ticket className="h-5 w-5 text-purple-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">My Bookings</p>
                      <p className="text-2xl font-black">{bookings.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Spent (INR)</p>
                      <p className="text-xl font-black text-emerald-500">₹{totalSpent}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Ticket className="h-5 w-5 text-indigo-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Shows</p>
                      <p className="text-2xl font-black">{shows.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Ticket className="h-5 w-5 text-amber-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Upcoming Shows</p>
                      <p className="text-2xl font-black">{shows.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Landmark className="h-5 w-5 text-rose-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Active Theatres</p>
                      <p className="text-2xl font-black">{new Set(shows.map(s => s.theatreId)).size}</p>
                    </div>
                  </div>

                  {/* Quick Logs */}
                  <div className="pt-4 text-xs font-semibold text-slate-450 dark:text-slate-500 text-center">
                    CinePass Client Portal • Connected
                  </div>
                </div>
              )}

              {/* 2. MOVIE MANAGEMENT */}
              {activeTab === "movies" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Movies Catalog
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          <th className="py-3 text-left">Movie Title</th>
                          <th className="py-3 text-left">Director</th>
                          <th className="py-3 text-left">Language</th>
                          <th className="py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {movies.map(m => (
                          <tr key={m._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="py-4 font-bold text-slate-800 dark:text-white">{m.name || m.title}</td>
                            <td className="py-4">{m.director}</td>
                            <td className="py-4">{m.language}</td>
                            <td className="py-4 text-xs font-bold">{m.releaseStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. THEATRE MANAGEMENT */}
              {activeTab === "theatres" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      My Theatres
                    </h2>
                    <button
                      onClick={() => {
                        setEditItem(null);
                        setTheatreForm({ name: "", description: "", city: "Kolkata", pinCode: "", address: "", movies: [] });
                        setTheatreModal(true);
                      }}
                      className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Theatre
                    </button>
                  </div>

                  {theatres.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Landmark className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 font-semibold mb-4">You have not created any theatres yet.</p>
                      <button
                        onClick={() => {
                          setEditItem(null);
                          setTheatreForm({ name: "", description: "", city: "Kolkata", pinCode: "", address: "", movies: [] });
                          setTheatreModal(true);
                        }}
                        className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="h-4.5 w-4.5" /> Create Your First Theatre
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                            <th className="py-3 text-left">Theatre Name</th>
                            <th className="py-3 text-left">City</th>
                            <th className="py-3 text-left">Address</th>
                            <th className="py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                          {theatres.map(t => (
                            <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                              <td className="py-4 font-bold text-slate-800 dark:text-white">{t.name}</td>
                              <td className="py-4 font-semibold text-primary">{t.city}</td>
                              <td className="py-4 max-w-[200px] truncate">{t.address}</td>
                              <td className="py-4 text-right flex justify-end gap-3">
                                <button
                                  onClick={() => {
                                    setEditItem(t);
                                    setTheatreForm({
                                      name: t.name, description: t.description || "",
                                      city: t.city, pinCode: t.pinCode || "", address: t.address,
                                      movies: t.movies || []
                                    });
                                    setTheatreModal(true);
                                  }}
                                  className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleTheatreDelete(t._id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 4. SHOW SCHEDULER */}
              {activeTab === "shows" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        My Shows
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage all shows scheduled in your theatres</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditItem(null);
                        setShowForm({
                          theatreId: theatres[0]?._id || "",
                          movieId: movies[0]?._id || "",
                          timing: "04:30 PM", noOfSeats: 120, price: 250, format: "2D"
                        });
                        setShowModal(true);
                      }}
                      className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Schedule Show
                    </button>
                  </div>

                  {showsError ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-dashed border-red-200 dark:border-red-800">
                      <p className="text-red-500 font-semibold mb-2">Unable to load your shows.</p>
                      <p className="text-red-400 text-sm">Please try again.</p>
                    </div>
                  ) : shows.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Ticket className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 font-semibold mb-4">No shows scheduled yet.</p>
                      <button
                        onClick={() => {
                          setEditItem(null);
                          setShowForm({
                            theatreId: theatres[0]?._id || "",
                            movieId: movies[0]?._id || "",
                            timing: "04:30 PM", noOfSeats: 120, price: 250, format: "2D"
                          });
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="h-4.5 w-4.5" /> Schedule Your First Show
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                            <th className="py-3 text-left">Movie Name</th>
                            <th className="py-3 text-left">Theatre Name</th>
                            <th className="py-3 text-left">Show Date</th>
                            <th className="py-3 text-left">Show Time</th>
                            <th className="py-3 text-left">Ticket Price</th>
                            <th className="py-3 text-left">Total Seats</th>
                            <th className="py-3 text-left">Available Seats</th>
                            <th className="py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                          {shows.map(s => {
                            const movieName = movies.find(m => m._id === s.movieId)?.name || movies.find(m => m._id === s.movieId)?.title || "Unknown Movie";
                            const theatreName = theatres.find(t => t._id === s.theatreId)?.name || "Unknown Theatre";
                            const date = s.date ? new Date(s.date).toLocaleDateString() : "TBD";
                            const timing = Array.isArray(s.timings) ? s.timings.join(", ") : (s.timings || s.timing);
                            
                            return (
                              <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                <td className="py-4 font-bold text-slate-800 dark:text-white max-w-[150px] truncate">{movieName}</td>
                                <td className="py-4 max-w-[150px] truncate font-semibold text-primary">{theatreName}</td>
                                <td className="py-4">{date}</td>
                                <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">{timing}</td>
                                <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">₹{s.ticketPrice || s.price}</td>
                                <td className="py-4">{s.noOfSeats}</td>
                                <td className="py-4">{s.availableSeats ?? s.noOfSeats}</td>
                                <td className="py-4 text-right flex justify-end gap-3">
                                  <button
                                    onClick={() => {
                                      setEditItem(s);
                                      setShowForm({
                                        theatreId: s.theatreId,
                                        movieId: s.movieId,
                                        timing: timing,
                                        noOfSeats: s.noOfSeats, 
                                        price: s.ticketPrice || s.price, 
                                        format: s.format || "2D"
                                      });
                                      setShowModal(true);
                                    }}
                                    className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit3 className="h-4.5 w-4.5" />
                                  </button>
                                  <button
                                    onClick={() => handleShowDelete(s._id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 5. BOOKINGS LIST */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-850 pb-4">
                    My Bookings
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          <th className="py-3 text-left">Booking ID</th>
                          <th className="py-3 text-left">Timing</th>
                          <th className="py-3 text-left">Seats</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {bookings.map(b => (
                          <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="py-4 font-mono font-bold text-[10px] max-w-[100px] truncate">{b._id}</td>
                            <td className="py-4 font-semibold">{b.timing}</td>
                            <td className="py-4 text-xs font-bold text-primary">{b.seats?.join(", ") || b.noOfSeats}</td>
                            <td className="py-4 text-[10px] font-black uppercase text-emerald-500">{b.status}</td>
                            <td className="py-4 text-right font-bold text-slate-800 dark:text-white">₹{b.totalCosts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* CRUD Movie Modal */}
      {movieModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-850 p-6 space-y-4 shadow-2xl my-8">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b pb-2">
              {editItem ? "Edit Movie Settings" : "Add Movie to Catalog"}
            </h3>
            
            <form onSubmit={handleMovieSubmit} className="space-y-3.5 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Movie Title</label>
                  <input
                    type="text" required value={movieForm.name}
                    onChange={(e) => setMovieForm({...movieForm, name: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Director</label>
                  <input
                    type="text" required value={movieForm.director}
                    onChange={(e) => setMovieForm({...movieForm, director: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Description</label>
                <textarea
                  required value={movieForm.description} rows="2"
                  onChange={(e) => setMovieForm({...movieForm, description: e.target.value})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Casts (Comma separated)</label>
                  <input
                    type="text" required value={movieForm.casts} placeholder="Actor A, Actor B"
                    onChange={(e) => setMovieForm({...movieForm, casts: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Trailer Embed URL</label>
                  <input
                    type="text" required value={movieForm.trailerUrl} placeholder="https://www.youtube.com/embed/..."
                    onChange={(e) => setMovieForm({...movieForm, trailerUrl: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Language</label>
                  <input
                    type="text" required value={movieForm.language}
                    onChange={(e) => setMovieForm({...movieForm, language: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Release Date</label>
                  <input
                    type="date" required value={movieForm.releaseDate}
                    onChange={(e) => setMovieForm({...movieForm, releaseDate: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Status</label>
                  <select
                    value={movieForm.releaseStatus}
                    onChange={(e) => setMovieForm({...movieForm, releaseStatus: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="Released">Released</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setMovieModal(false)}
                  className="w-1/2 py-2 border text-slate-500 rounded-lg hover:bg-slate-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Theatre Modal */}
      {theatreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-855 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b pb-2">
              {editItem ? "Edit Theatre Details" : "Register New Theatre"}
            </h3>
            
            <form onSubmit={handleTheatreSubmit} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Theatre Name</label>
                <input
                  type="text" required value={theatreForm.name}
                  onChange={(e) => setTheatreForm({...theatreForm, name: e.target.value})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">City</label>
                  <input
                    type="text" required value={theatreForm.city}
                    onChange={(e) => setTheatreForm({...theatreForm, city: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Pin Code</label>
                  <input
                    type="number" required value={theatreForm.pinCode}
                    onChange={(e) => setTheatreForm({...theatreForm, pinCode: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Full Address</label>
                <input
                  type="text" required value={theatreForm.address}
                  onChange={(e) => setTheatreForm({...theatreForm, address: e.target.value})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1 mt-2">
                <label className="font-bold text-slate-400">Movies Available</label>
                <div className="max-h-32 overflow-y-auto border dark:border-slate-700/80 rounded p-2 bg-slate-50 dark:bg-slate-900 grid grid-cols-2 gap-2">
                  {movies.map(m => (
                    <label key={m._id} className="flex items-center space-x-2 text-xs">
                      <input 
                        type="checkbox" 
                        checked={theatreForm.movies.includes(m._id)}
                        onChange={(e) => {
                          const newMovies = e.target.checked 
                            ? [...theatreForm.movies, m._id] 
                            : theatreForm.movies.filter(id => id !== m._id);
                          setTheatreForm({...theatreForm, movies: newMovies});
                        }}
                      />
                      <span className="truncate">{m.name || m.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setTheatreModal(false)}
                  className="w-1/2 py-2 border text-slate-500 rounded-lg hover:bg-slate-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 font-bold"
                >
                  Save Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Show Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-855 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b pb-2">
              {editItem ? "Edit Scheduled Show" : "Schedule New Show"}
            </h3>
            
            <form onSubmit={handleShowSubmit} className="space-y-3.5 text-xs text-left">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Select Theatre</label>
                <select
                  value={showForm.theatreId}
                  onChange={(e) => setShowForm({...showForm, theatreId: e.target.value, movieId: ""})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                >
                  <option value="">-- Choose Theatre --</option>
                  {theatres.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({...showForm, movieId: e.target.value})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  disabled={!showForm.theatreId}
                >
                  <option value="">-- Choose Movie --</option>
                  {(() => {
                    const selectedTheatre = theatres.find(t => t._id === showForm.theatreId);
                    const theatreMovieIds = selectedTheatre?.movies || [];
                    const availableMovies = theatreMovieIds.length > 0
                      ? movies.filter(m => theatreMovieIds.includes(m._id))
                      : [];
                    return availableMovies.length > 0
                      ? availableMovies.map(m => (
                          <option key={m._id} value={m._id}>{m.name || m.title}</option>
                        ))
                      : [<option key="none" value="" disabled>No movies assigned to this theatre</option>];
                  })()}
                </select>
                {showForm.theatreId && (() => {
                  const selectedTheatre = theatres.find(t => t._id === showForm.theatreId);
                  const theatreMovieIds = selectedTheatre?.movies || [];
                  return theatreMovieIds.length === 0 ? (
                    <p className="text-[10px] text-amber-500 font-semibold mt-1">⚠ This theatre has no movies assigned. Add movies via My Theatres first.</p>
                  ) : null;
                })()}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Timing</label>
                  <input
                    type="text" required value={showForm.timing} placeholder="04:30 PM"
                    onChange={(e) => setShowForm({...showForm, timing: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Price (INR)</label>
                  <input
                    type="number" required value={showForm.price}
                    onChange={(e) => setShowForm({...showForm, price: parseInt(e.target.value) || ""})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Total Seats</label>
                  <input
                    type="number" required value={showForm.noOfSeats}
                    onChange={(e) => setShowForm({...showForm, noOfSeats: parseInt(e.target.value) || ""})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Format</label>
                  <input
                    type="text" required value={showForm.format} placeholder="2D"
                    onChange={(e) => setShowForm({...showForm, format: e.target.value})}
                    className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="w-1/2 py-2 border text-slate-500 rounded-lg hover:bg-slate-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-primary text-white rounded-lg hover:bg-primary/95 font-bold"
                >
                  Save Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ClientDashboard;
