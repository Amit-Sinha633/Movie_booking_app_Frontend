import axiosInstance from "../api/axios";

// Local cache for mock shows to keep state persistent across page transitions during testing
let MOCK_SHOWS = [];

const TIMINGS = ["09:30 AM", "01:00 PM", "04:30 PM", "08:15 PM", "11:00 PM"];
const FORMATS = ["2D", "3D", "IMAX 3D"];

// Helper to generate shows dynamically for a movie and theatre if none exist
const generateMockShows = (theatreId, movieId) => {
  const generated = [];
  
  // Create 3 shows with different timings
  TIMINGS.slice(0, 4).forEach((timing, idx) => {
    const showId = `s_${theatreId}_${movieId}_${idx}`;
    generated.push({
      _id: showId,
      theatreId,
      movieId,
      timing,
      noOfSeats: 120,
      price: idx === 3 ? 400 : 250, // Evening shows are pricier
      format: FORMATS[idx % FORMATS.length],
      seatConfigaration: JSON.stringify({
        booked: ["A-4", "A-5", "B-12", "C-8", "C-9", "F-5", "F-6"],
      })
    });
  });
  
  return generated;
};

export const showService = {
  // Get shows for a movie and/or theatre
  async getShows(theatreId, movieId) {
    try {
      const response = await axiosInstance.get("/mba/api/v1/show/getShows", {
        params: { theatreId, movieId }
      });
      const shows = response.data?.data || response.data || [];
      
      if (shows.length === 0 && theatreId && movieId) {
        // If API succeeded but returned empty, check if we already have them in our cache
        const cached = MOCK_SHOWS.filter(s => s.theatreId === theatreId && s.movieId === movieId);
        if (cached.length > 0) return cached;
        
        // Otherwise generate and store
        const generated = generateMockShows(theatreId, movieId);
        MOCK_SHOWS = [...MOCK_SHOWS, ...generated];
        return generated;
      }
      
      return shows;
    } catch (error) {
      console.warn("Failed to get shows from API, returning generated mock shows", error);
      if (theatreId && movieId) {
        const cached = MOCK_SHOWS.filter(s => s.theatreId === theatreId && s.movieId === movieId);
        if (cached.length > 0) return cached;
        
        const generated = generateMockShows(theatreId, movieId);
        MOCK_SHOWS = [...MOCK_SHOWS, ...generated];
        return generated;
      }
      return MOCK_SHOWS;
    }
  },

  // Get a single show details
  async getShowById(showId) {
    try {
      // If it's a mock show
      if (showId.startsWith("s_")) {
        const mock = MOCK_SHOWS.find(s => s._id === showId);
        if (mock) return mock;
      }
      
      // The backend doesn't have a direct GET /show/:id endpoint, but we can query all shows and filter
      const response = await axiosInstance.get("/mba/api/v1/show/getShows");
      const shows = response.data?.data || response.data || [];
      const show = shows.find(s => s._id === showId);
      
      if (!show) {
        // Fallback to cache
        const mock = MOCK_SHOWS.find(s => s._id === showId);
        if (mock) return mock;
        
        // Or reconstruct it from ID fields
        const parts = showId.split("_");
        if (parts.length >= 4) {
          const [_, tId, mId, idx] = parts;
          return {
            _id: showId,
            theatreId: tId,
            movieId: mId,
            timing: TIMINGS[parseInt(idx) || 0],
            noOfSeats: 120,
            price: 250,
            format: "2D",
            seatConfigaration: JSON.stringify({ booked: ["A-4", "A-5"] })
          };
        }
      }
      return show;
    } catch (error) {
      const mock = MOCK_SHOWS.find(s => s._id === showId);
      if (mock) return mock;
      throw error;
    }
  },

  // Create show (Admin)
  async createShow(showData) {
    try {
      const response = await axiosInstance.post("/mba/api/v1/show/createShow", showData);
      return response.data?.data || response.data;
    } catch (error) {
      const newMock = {
        _id: "s_" + Date.now(),
        seatConfigaration: JSON.stringify({ booked: [] }),
        ...showData
      };
      MOCK_SHOWS.push(newMock);
      return newMock;
    }
  },

  // Update show (Admin)
  async updateShow(showId, showData) {
    try {
      const response = await axiosInstance.patch(`/mba/api/v1/show/updateShow/${showId}`, showData);
      return response.data?.data || response.data;
    } catch (error) {
      const idx = MOCK_SHOWS.findIndex(s => s._id === showId);
      if (idx !== -1) {
        MOCK_SHOWS[idx] = { ...MOCK_SHOWS[idx], ...showData };
        return MOCK_SHOWS[idx];
      }
      throw error;
    }
  },

  // Delete show (Admin)
  async deleteShow(showId) {
    try {
      const response = await axiosInstance.delete("/mba/api/v1/show/deleteShow", {
        params: { showId }
      });
      return response.data;
    } catch (error) {
      const idx = MOCK_SHOWS.findIndex(s => s._id === showId);
      if (idx !== -1) {
        MOCK_SHOWS.splice(idx, 1);
        return { success: true, message: "Mock deleted" };
      }
      throw error;
    }
  }
};
