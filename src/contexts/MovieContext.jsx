import React, { createContext, useContext, useState, useEffect } from "react";
import { movieService } from "../services/movieService";

const MovieContext = createContext(null);

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await movieService.getMovies();
      setMovies(data);
      setError(null);
    } catch (err) {
      console.error("Error loading movies:", err);
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const getFilteredMovies = () => {
    return movies.filter((movie) => {
      const matchesSearch = movie.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        movie.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = !filterGenre || 
        movie.genre?.toLowerCase().includes(filterGenre.toLowerCase());
        
      const matchesLanguage = !filterLanguage || 
        movie.language?.toLowerCase() === filterLanguage.toLowerCase();
        
      return matchesSearch && matchesGenre && matchesLanguage;
    });
  };

  const getMovieById = (id) => {
    return movies.find((movie) => movie._id === id);
  };

  const value = {
    movies,
    loading,
    error,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    filterGenre,
    setFilterGenre,
    filterLanguage,
    setFilterLanguage,
    filteredMovies: getFilteredMovies(),
    getMovieById,
    refreshMovies: fetchMovies
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
