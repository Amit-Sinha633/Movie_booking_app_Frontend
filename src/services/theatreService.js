import axiosInstance from "../api/axios";

// Mock Theatres data for fallback
const MOCK_THEATRES = [
  {
    _id: "t1",
    name: "PVR: Forum Mall, Elgin Road",
    description: "Premium cinema hall experience with Dolby Atmos & 4K projection.",
    city: "Kolkata",
    pinCode: 700020,
    address: "Forum Mall, 4th Floor, 10/3, Elgin Rd, Kolkata, West Bengal",
    movies: ["m1", "m2", "m3", "m4"],
    facilities: ["Food & Beverage", "Recliner Seats", "E-Ticket", "Valet Parking"]
  },
  {
    _id: "t2",
    name: "INOX: Quest Mall, Ballygunge",
    description: "Luxury cinema with INSIGNIA recliners and gourmet menu.",
    city: "Kolkata",
    pinCode: 700017,
    address: "Quest Mall, 33, Syed Amir Ali Ave, Beck Bagan, Ballygunge, Kolkata, West Bengal",
    movies: ["m1", "m2", "m4"],
    facilities: ["Gourmet Food", "Recliners", "M-Ticket", "Parking"]
  },
  {
    _id: "t3",
    name: "Cinepolis: Acropolis Mall, Kasba",
    description: "Modern multiplex experience with comfortable seating.",
    city: "Kolkata",
    pinCode: 700107,
    address: "Acropolis Mall, 1858/1, Rajdanga Main Rd, Kasba, Kolkata, West Bengal",
    movies: ["m2", "m3", "m4", "m5"],
    facilities: ["Food Court", "Dolby Digital", "Paperless Entry"]
  },
  {
    _id: "t4",
    name: "PVR: Dynamix Mall, Juhu",
    description: "Flagship multiplex in Mumbai's premium suburb.",
    city: "Mumbai",
    pinCode: 400049,
    address: "Dynamix Mall, Near Chandan Cinema, Juhu, Mumbai, Maharashtra",
    movies: ["m1", "m2", "m3"],
    facilities: ["Recliner Lounge", "ATM", "Disabled Access", "Food & Drink"]
  },
  {
    _id: "t5",
    name: "PVR: Plaza, Connaught Place",
    description: "Heritage single screen transformed into a premium modern theatre.",
    city: "Delhi",
    pinCode: 110001,
    address: "H-Block, Connaught Place, New Delhi, Delhi",
    movies: ["m1", "m3", "m4"],
    facilities: ["Cafe", "Classic Vibes", "E-Ticket"]
  }
];

export const theatreService = {
  // Get all theatres
  async getTheatres(city = "") {
    try {
      const response = await axiosInstance.get("/mba/theatre/api/v1/theatres");
      const theatres = response.data?.data || response.data || [];
      
      let list = theatres.length > 0 ? theatres : MOCK_THEATRES;
      
      // Inject standard facilities into backend items if missing
      list = list.map(t => ({
        ...t,
        facilities: t.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"]
      }));
      
      if (city) {
        return list.filter(t => t.city.toLowerCase() === city.toLowerCase());
      }
      return list;
    } catch (error) {
      console.warn("Failed to get theatres from backend, fallback to mock", error);
      if (city) {
        return MOCK_THEATRES.filter(t => t.city.toLowerCase() === city.toLowerCase());
      }
      return MOCK_THEATRES;
    }
  },

  // Get single theatre
  async getTheatre(theatreId) {
    try {
      if (theatreId.startsWith("t")) {
        const mock = MOCK_THEATRES.find(t => t._id === theatreId);
        if (mock) return mock;
      }
      const response = await axiosInstance.get(`/mba/theatre/api/v1/theatre/${theatreId}`);
      const t = response.data?.data || response.data;
      return {
        ...t,
        facilities: t.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"]
      };
    } catch (error) {
      const mock = MOCK_THEATRES.find(t => t._id === theatreId) || MOCK_THEATRES[0];
      return mock;
    }
  },

  // Create theatre
  async createTheatre(theatreData) {
    try {
      const response = await axiosInstance.post("/mba/theatre/api/v1/theatre", theatreData);
      return response.data?.data || response.data;
    } catch (error) {
      const newMock = {
        _id: "t" + Date.now(),
        movies: [],
        ...theatreData
      };
      MOCK_THEATRES.push(newMock);
      return newMock;
    }
  },

  // Update theatre
  async updateTheatre(theatreId, theatreData) {
    try {
      // In routes, theatre update PUT is `/theatre` and has body
      const response = await axiosInstance.put("/mba/theatre/api/v1/theatre", {
        theatreId,
        ...theatreData
      });
      return response.data?.data || response.data;
    } catch (error) {
      const idx = MOCK_THEATRES.findIndex(t => t._id === theatreId);
      if (idx !== -1) {
        MOCK_THEATRES[idx] = { ...MOCK_THEATRES[idx], ...theatreData };
        return MOCK_THEATRES[idx];
      }
      throw error;
    }
  },

  // Delete theatre
  async deleteTheatre(theatreId) {
    try {
      const response = await axiosInstance.delete(`/mba/theatre/api/v1/theatre/${theatreId}`);
      return response.data;
    } catch (error) {
      const idx = MOCK_THEATRES.findIndex(t => t._id === theatreId);
      if (idx !== -1) {
        MOCK_THEATRES.splice(idx, 1);
        return { success: true, message: "Mock deleted" };
      }
      throw error;
    }
  },

  // Link movie to theatre
  async addMovieToTheatre(theatreId, movieId) {
    try {
      const response = await axiosInstance.patch(`/mba/theatre/api/v1/${theatreId}/movies`, {
        movieId
      });
      return response.data;
    } catch (error) {
      const t = MOCK_THEATRES.find(t => t._id === theatreId);
      if (t) {
        if (!t.movies.includes(movieId)) {
          t.movies.push(movieId);
        }
        return { success: true, message: "Linked mock movie" };
      }
      throw error;
    }
  },

  // Get movies in theatre
  async getMoviesInTheatre(theatreId) {
    try {
      const response = await axiosInstance.get(`/mba/theatre/api/v1/${theatreId}/movies`);
      return response.data?.data || response.data || [];
    } catch (error) {
      const t = MOCK_THEATRES.find(t => t._id === theatreId);
      return t ? t.movies : [];
    }
  }
};
