import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { movieService } from "../services/movieService";
import { theatreService } from "../services/theatreService";
import { showService } from "../services/showService";
import { bookingService } from "../services/bookingService";
import { userService } from "../services/userService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { Film, Ticket, Shield, Users, Landmark, Plus, Trash2, Edit3, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";

function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Data lists
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Modals visibility
  const [movieModal, setMovieModal] = useState(false);
  const [theatreModal, setTheatreModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Edit contexts
  const [editItem, setEditItem] = useState(null); // stores active movie/theatre/show to update

  // Movie Form Fields
  const [movieForm, setMovieForm] = useState({
    name: "", description: "", casts: "", trailerUrl: "",
    language: "English", releaseDate: "", director: "", releaseStatus: "Released"
  });

  // Theatre Form Fields
  const [theatreForm, setTheatreForm] = useState({
    name: "", description: "", city: "Kolkata", pinCode: "", address: ""
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
      const tl = await theatreService.getTheatres();
      setTheatres(tl);
      const sl = await showService.getShows();
      setShows(sl);
      const bl = await bookingService.getAllBookings();
      setBookings(bl);
      const ul = await userService.getAllUsers();
      setUsers(ul);
    } catch (e) {
      console.error("Failed to load admin dashboard indices", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  // Dashboard Stats Calculations
  const totalRevenue = bookings
    .filter(b => b.status === "SUCCESSFULL" || b.status === "SUCCESS" || b.status === "SUCCESSFULL")
    .reduce((sum, b) => sum + (b.totalCosts || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Admin Sidebar Navigation */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 shadow-sm text-center">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-primary flex items-center justify-center font-bold text-lg mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-3">Administrator</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 bg-rose-500/10 text-primary inline-block px-2 py-0.5 rounded">
                SYSTEM PORTAL
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              {[
                { id: "dashboard", label: "Dashboard Hub", icon: Shield },
                { id: "movies", label: "Movie Management", icon: Film },
                { id: "theatres", label: "Theatre Settings", icon: Landmark },
                { id: "shows", label: "Show Scheduler", icon: Ticket },
                { id: "bookings", label: "Booking History", icon: Ticket },
                { id: "users", label: "System Users", icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-md shadow-primary/10"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-655 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Panels content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {/* 1. DASHBOARD HUB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-850 pb-4">
                    Administrative Dashboard
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
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Theatres</p>
                      <p className="text-2xl font-black">{theatres.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <Users className="h-5 w-5 text-green-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Users</p>
                      <p className="text-2xl font-black">{users.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20 rounded-xl space-y-1 text-left shadow-xs">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Revenue (INR)</p>
                      <p className="text-xl font-black text-emerald-500">₹{totalRevenue}</p>
                    </div>
                  </div>

                  {/* Quick Logs */}
                  <div className="pt-4 text-xs font-semibold text-slate-450 dark:text-slate-500 text-center">
                    CinePass Administrative System V1.0 • Connected to Local Mongo Instance
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
                    <button
                      onClick={() => {
                        setEditItem(null);
                        setMovieForm({
                          name: "", description: "", casts: "", trailerUrl: "",
                          language: "English", releaseDate: "", director: "", releaseStatus: "Released"
                        });
                        setMovieModal(true);
                      }}
                      className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Movie
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          <th className="py-3 text-left">Movie Title</th>
                          <th className="py-3 text-left">Director</th>
                          <th className="py-3 text-left">Language</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {movies.map(m => (
                          <tr key={m._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="py-4 font-bold text-slate-800 dark:text-white">{m.name}</td>
                            <td className="py-4">{m.director}</td>
                            <td className="py-4">{m.language}</td>
                            <td className="py-4 text-xs font-bold">{m.releaseStatus}</td>
                            <td className="py-4 text-right flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  setEditItem(m);
                                  setMovieForm({
                                    name: m.name, description: m.description, 
                                    casts: Array.isArray(m.casts) ? m.casts.join(",") : m.casts, 
                                    trailerUrl: m.trailerUrl, language: m.language, 
                                    releaseDate: m.releaseDate ? m.releaseDate.split("T")[0] : "", 
                                    director: m.director, releaseStatus: m.releaseStatus
                                  });
                                  setMovieModal(true);
                                }}
                                className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleMovieDelete(m._id)}
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
                </div>
              )}

              {/* 3. THEATRE MANAGEMENT */}
              {activeTab === "theatres" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Theatres Configuration
                    </h2>
                    <button
                      onClick={() => {
                        setEditItem(null);
                        setTheatreForm({ name: "", description: "", city: "Kolkata", pinCode: "", address: "" });
                        setTheatreModal(true);
                      }}
                      className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Theatre
                    </button>
                  </div>

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
                                    city: t.city, pinCode: t.pinCode || "", address: t.address
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
                </div>
              )}

              {/* 4. SHOW SCHEDULER */}
              {activeTab === "shows" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Shows Scheduler
                    </h2>
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
                      <Plus className="h-4 w-4" /> Add Show
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          <th className="py-3 text-left">Show Movie ID</th>
                          <th className="py-3 text-left">Theatre ID</th>
                          <th className="py-3 text-left">Timing</th>
                          <th className="py-3 text-left">Price (INR)</th>
                          <th className="py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {shows.map(s => {
                          const movieName = movies.find(m => m._id === s.movieId)?.name || s.movieId;
                          const theatreName = theatres.find(t => t._id === s.theatreId)?.name || s.theatreId;
                          return (
                            <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                              <td className="py-4 font-bold text-slate-800 dark:text-white max-w-[150px] truncate">{movieName}</td>
                              <td className="py-4 max-w-[150px] truncate">{theatreName}</td>
                              <td className="py-4 font-semibold text-primary">{s.timing}</td>
                              <td className="py-4 font-bold">₹{s.price}</td>
                              <td className="py-4 text-right flex justify-end gap-3">
                                <button
                                  onClick={() => {
                                    setEditItem(s);
                                    setShowForm({
                                      theatreId: s.theatreId,
                                      movieId: s.movieId,
                                      timing: s.timing, noOfSeats: s.noOfSeats, price: s.price, format: s.format || "2D"
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
                </div>
              )}

              {/* 5. BOOKINGS LIST */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-850 pb-4">
                    Bookings Registry
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

              {/* 6. USERS SYSTEM */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-850 pb-4">
                    System Users Registry
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-655 dark:text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          <th className="py-3 text-left">Name</th>
                          <th className="py-3 text-left">Email Address</th>
                          <th className="py-3 text-left">Role</th>
                          <th className="py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="py-4 font-bold text-slate-800 dark:text-white">{u.name}</td>
                            <td className="py-4 font-mono text-xs">{u.email}</td>
                            <td className="py-4"><span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">{u.userRole}</span></td>
                            <td className="py-4 text-right"><span className="text-[10px] font-black text-emerald-500">{u.userStatus}</span></td>
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
                <label className="font-bold text-slate-400">Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({...showForm, movieId: e.target.value})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                >
                  <option value="">-- Choose Movie --</option>
                  {movies.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">Select Theatre</label>
                <select
                  value={showForm.theatreId}
                  onChange={(e) => setShowForm({...showForm, theatreId: e.target.value})}
                  className="block w-full p-2 border dark:border-slate-700/80 rounded bg-slate-50 dark:bg-slate-900"
                >
                  <option value="">-- Choose Theatre --</option>
                  {theatres.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
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

export default Admin;
