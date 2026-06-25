import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMovies } from "../contexts/MovieContext";
import { useTheme } from "../contexts/ThemeContext";
import { Search, MapPin, Sun, Moon, User, ChevronDown, LogOut, ShieldAlert, BookOpen, UserCheck } from "lucide-react";

function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity } = useMovies();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If we're not on Home page, navigate to Home to show searched items
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const cities = ["Kolkata", "Mumbai", "Delhi", "Bengaluru", "Chennai"];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-dark-bg/85 border-b border-slate-200/50 dark:border-slate-800/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <Link to="/">
              <span className="text-2xl font-extrabold tracking-wider text-primary flex items-center gap-1.5">
                CINE<span className="text-slate-800 dark:text-white">PASS</span>
              </span>
            </Link>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex flex-grow max-w-xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* City Selector */}
            <div className="relative flex items-center text-slate-700 dark:text-slate-300 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary mr-1" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none pr-6 pl-1 py-1 cursor-pointer focus:ring-0 focus:outline-none text-slate-700 dark:text-slate-300 font-semibold text-sm appearance-none"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="dark:bg-dark-card dark:text-white bg-white text-slate-900">
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Access Controls */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-100/50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 transition-colors duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/25 border border-primary/40 text-primary flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-20 animate-fade-in text-slate-700 dark:text-slate-200">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold truncate">{user?.email}</p>
                        <p className="text-[10px] inline-block px-1.5 py-0.5 bg-primary/10 text-primary rounded font-bold uppercase mt-1">
                          {user?.userRole}
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        My Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 text-primary font-semibold transition-colors"
                        >
                          <ShieldAlert className="h-4 w-4 text-primary" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1.5"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/95 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all duration-200 shadow-md shadow-primary/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub menu bar */}
      <div className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-900/60 text-xs sm:text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-6 font-medium flex-shrink-0">
            <Link to="/" className="hover:text-primary transition-colors text-slate-800 dark:text-slate-300 font-semibold">Movies</Link>
            <span className="cursor-pointer hover:text-primary transition-colors">Stream</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Events</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Plays</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Sports</span>
            <span className="cursor-pointer hover:text-primary transition-colors font-semibold text-rose-500 flex items-center gap-1">
              Offers
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
            <span className="cursor-pointer hover:text-primary transition-colors">ListYourShow</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Corporates</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Gift Cards</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;