import axiosInstance from "../api/axios";

// Premium Movie Mock Metadata for enriching basic backend data
const MOCK_MOVIES = [
  {
    _id: "m1",
    name: "Deadpool & Wolverine",
    description: "A listless Wade Wilson toils in civilian life. His efforts to fit in are behind him. When his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    language: "English",
    casts: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin"],
    director: "Shawn Levy",
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
    releaseDate: "2024-07-26",
    releaseStatus: "Released",
    // Frontend-only visual assets
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=60",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
    genre: "Action, Comedy, Sci-Fi",
    rating: 8.9,
    likesPercent: 94,
    duration: "2h 8m",
    format: "2D, 3D, IMAX 3D"
  },
  {
    _id: "m2",
    name: "Inside Out 2",
    description: "Disney and Pixar's Inside Out 2 returns to the mind of newly minted teenager Riley just as headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!",
    language: "English",
    casts: ["Amy Poehler", "Maya Hawke", "Phyllis Smith", "Lewis Black"],
    director: "Kelsey Mann",
    trailerUrl: "https://www.youtube.com/embed/LEjhY2iQ274",
    releaseDate: "2024-06-14",
    releaseStatus: "Released",
    posterUrl: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop&q=60",
    backdropUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
    genre: "Animation, Comedy, Family",
    rating: 9.1,
    likesPercent: 96,
    duration: "1h 36m",
    format: "2D, 3D"
  },
  {
    _id: "m3",
    name: "Kalki 2898 AD",
    description: "A modern avatar of Vishnu, a Hindu god, is believed to have descended to earth to protect the world from evil forces in a futuristic post-apocalyptic city of Kashi.",
    language: "Telugu",
    casts: ["Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone"],
    director: "Nag Ashwin",
    trailerUrl: "https://www.youtube.com/embed/kQDd1AhGI90",
    releaseDate: "2024-06-27",
    releaseStatus: "Released",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&auto=format&fit=crop&q=60",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    genre: "Sci-Fi, Action, Epic",
    rating: 8.7,
    likesPercent: 91,
    duration: "3h 1m",
    format: "2D, 3D, IMAX 3D"
  },
  {
    _id: "m4",
    name: "Stree 2",
    description: "In the town of Chanderi, the residents are once again haunted by a sinister male force known as 'Sarkata' who is abducting independent women. The gang must reunite to save their town.",
    language: "Hindi",
    casts: ["Shraddha Kapoor", "Rajkummar Rao", "Pankaj Tripathi", "Aparshakti Khurana"],
    director: "Amar Kaushik",
    trailerUrl: "https://www.youtube.com/embed/KVnheGhrRAw",
    releaseDate: "2024-08-15",
    releaseStatus: "Released",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
    backdropUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&auto=format&fit=crop&q=80",
    genre: "Horror, Comedy",
    rating: 8.8,
    likesPercent: 92,
    duration: "2h 27m",
    format: "2D"
  },
  {
    _id: "m5",
    name: "Spider-Man: Beyond the Spider-Verse",
    description: "Miles Morales embarks on his next adventure across the multiverse, joining forces with Gwen Stacy and a new team of Spider-People to face a villain more powerful than anything they have ever encountered.",
    language: "English",
    casts: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"],
    director: "Joaquim Dos Santos",
    trailerUrl: "https://www.youtube.com/embed/cbwK_3P6f38",
    releaseDate: "2026-12-18",
    releaseStatus: "Upcoming",
    posterUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=500&auto=format&fit=crop&q=60",
    backdropUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    genre: "Animation, Action, Sci-Fi",
    rating: 0.0,
    likesPercent: 98,
    duration: "2h 15m",
    format: "2D, 3D"
  }
];

// Helper to enrich a single movie item from backend with mock visual elements
const enrichMovie = (movie) => {
  if (!movie) return null;
  const match = MOCK_MOVIES.find(
    (m) => m.name.toLowerCase() === movie.name?.toLowerCase()
  );
  
  return {
    ...movie,
    posterUrl: movie.posterUrl || match?.posterUrl || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60",
    backdropUrl: movie.backdropUrl || match?.backdropUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
    genre: movie.genre || match?.genre || "Drama, Thriller",
    rating: movie.rating || match?.rating || 8.2,
    likesPercent: movie.likesPercent || match?.likesPercent || 85,
    duration: movie.duration || match?.duration || "2h 10m",
    format: movie.format || match?.format || "2D",
    casts: movie.casts?.length ? movie.casts : (match?.casts || ["Lead Actor", "Supporting Actor"]),
    director: movie.director || match?.director || "Unknown Director",
    trailerUrl: movie.trailerUrl || match?.trailerUrl || "https://www.youtube.com/embed/cbwK_3P6f38"
  };
};

export const movieService = {
  // Get all movies
  async getMovies() {
    try {
      const response = await axiosInstance.get("/mba/api/v1/movies");
      // The backend returns an array or standard response object.
      // In controllers/movie.controller.js, successResponse.data contains the movies
      const rawMovies = response.data?.data || response.data || [];
      
      // If we got nothing from backend, fallback to mock catalog
      if (rawMovies.length === 0) {
        return MOCK_MOVIES;
      }
      
      return rawMovies.map(enrichMovie);
    } catch (error) {
      console.warn("Failed to fetch movies from backend, falling back to mock catalog", error);
      return MOCK_MOVIES;
    }
  },

  // Get single movie by ID
  async getMovie(movieId) {
    try {
      // Check if it is a mock ID
      if (movieId.startsWith("m")) {
        const mock = MOCK_MOVIES.find(m => m._id === movieId);
        if (mock) return mock;
      }
      const response = await axiosInstance.get(`/mba/api/v1/movies/${movieId}`);
      const rawMovie = response.data?.data || response.data;
      return enrichMovie(rawMovie);
    } catch (error) {
      console.warn(`Failed to fetch movie ${movieId} from backend, fallback to mock`, error);
      const mock = MOCK_MOVIES.find(m => m._id === movieId) || MOCK_MOVIES[0];
      return mock;
    }
  },

  // Search movie by name
  async getMovieByName(name) {
    try {
      const response = await axiosInstance.get(`/mba/api/v1/movie?name=${encodeURIComponent(name)}`);
      const rawMovie = response.data?.data || response.data;
      return enrichMovie(rawMovie);
    } catch (error) {
      const mock = MOCK_MOVIES.find(m => m.name.toLowerCase().includes(name.toLowerCase()));
      if (mock) return mock;
      throw error;
    }
  },

  // Admin: Create movie
  async createMovie(movieData) {
    try {
      const response = await axiosInstance.post("/mba/api/v1/movies", movieData);
      return response.data?.data || response.data;
    } catch (error) {
      // Offline fallback: Add to session mock cache
      const newMock = {
        _id: "m" + (Date.now()),
        ...movieData,
        casts: typeof movieData.casts === "string" ? movieData.casts.split(",") : movieData.casts
      };
      MOCK_MOVIES.push(enrichMovie(newMock));
      return enrichMovie(newMock);
    }
  },

  // Admin: Update movie
  async updateMovie(movieId, movieData) {
    try {
      const response = await axiosInstance.put(`/mba/api/v1/movies/${movieId}`, movieData);
      return response.data?.data || response.data;
    } catch (error) {
      const idx = MOCK_MOVIES.findIndex(m => m._id === movieId);
      if (idx !== -1) {
        MOCK_MOVIES[idx] = enrichMovie({ ...MOCK_MOVIES[idx], ...movieData });
        return MOCK_MOVIES[idx];
      }
      throw error;
    }
  },

  // Admin: Delete movie
  async deleteMovie(movieId) {
    try {
      const response = await axiosInstance.delete(`/mba/api/v1/movies/${movieId}`);
      return response.data;
    } catch (error) {
      const idx = MOCK_MOVIES.findIndex(m => m._id === movieId);
      if (idx !== -1) {
        MOCK_MOVIES.splice(idx, 1);
        return { success: true, message: "Mock deleted" };
      }
      throw error;
    }
  }
};
