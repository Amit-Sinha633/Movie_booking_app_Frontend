import axiosInstance from "../api/axios";

// Helper to enrich a single movie item from backend with default visual elements
const enrichMovie = (movie) => {
  if (!movie) return null;
  return {
    ...movie,
    posterUrl: movie.posterUrl || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60",
    backdropUrl: movie.backdropUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
    genre: movie.genre || "Drama, Thriller",
    rating: movie.rating || 8.2,
    likesPercent: movie.likesPercent || 85,
    duration: movie.duration || "2h 10m",
    format: movie.format || "2D",
    casts: movie.casts?.length ? movie.casts : ["Lead Actor", "Supporting Actor"],
    director: movie.director || "Unknown Director",
    trailerUrl: movie.trailerUrl || "https://www.youtube.com/embed/cbwK_3P6f38"
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
