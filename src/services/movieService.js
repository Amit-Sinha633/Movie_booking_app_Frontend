import axiosInstance from "../api/axios";

// Helper to enrich a single movie item from backend with default visual elements
const enrichMovie = (movie) => {
  if (!movie) return null;
  return {
    ...movie,
    // Preserve image URLs exactly as they come from backend (or undefined/null)
    posterUrl: movie.posterUrl || null,
    backdropUrl: movie.backdropUrl || null,
    genre: movie.genre || "Drama, Action",
    rating: movie.rating || 8.0,
    likesPercent: movie.likesPercent || 80,
    duration: movie.duration || "2h 10m",
    format: movie.format || "2D",
    casts: movie.casts?.length ? movie.casts : ["Lead Actor", "Supporting Actor"],
    director: movie.director || "Unknown Director",
    trailerUrl: movie.trailerUrl || null
  };
};

export const movieService = {
  // Get all movies
  async getMovies() {
    const response = await axiosInstance.get("/mba/api/v1/movies");
    const rawMovies = response.data?.data || response.data || [];
    return rawMovies.map(enrichMovie);
  },

  // Get single movie by ID
  async getMovie(movieId) {
    const response = await axiosInstance.get(`/mba/api/v1/movies/${movieId}`);
    const rawMovie = response.data?.data || response.data;
    return enrichMovie(rawMovie);
  },

  // Search movie by name
  async getMovieByName(name) {
    const response = await axiosInstance.get(`/mba/api/v1/movie?name=${encodeURIComponent(name)}`);
    const rawMovie = response.data?.data || response.data;
    return enrichMovie(rawMovie);
  },

  // Admin: Create movie
  async createMovie(movieData) {
    const response = await axiosInstance.post("/mba/api/v1/movies", movieData);
    return response.data?.data || response.data;
  },

  // Admin: Update movie
  async updateMovie(movieId, movieData) {
    const response = await axiosInstance.put(`/mba/api/v1/movies/${movieId}`, movieData);
    return response.data?.data || response.data;
  },

  // Admin: Delete movie
  async deleteMovie(movieId) {
    const response = await axiosInstance.delete(`/mba/api/v1/movies/${movieId}`);
    return response.data;
  }
};
