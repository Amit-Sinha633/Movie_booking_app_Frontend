import axiosInstance from "../api/axios";

// Mock Theatres data for fallback when backend is unavailable
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
  // GET /mba/theatre/api/v1/theatres?city=...&movieId=...
  async getTheatres(city = "") {
    try {
      const params = {};
      if (city) params.city = city;

      const response = await axiosInstance.get("/mba/theatre/api/v1/theatres", { params });
      const theatres = response.data?.data || response.data || [];

      let list = theatres.length > 0 ? theatres : MOCK_THEATRES;

      // Inject facilities if missing (backend doesn't have this field)
      list = list.map((t) => ({
        ...t,
        facilities: t.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"],
      }));

      if (city) {
        return list.filter((t) => t.city?.toLowerCase() === city.toLowerCase());
      }
      return list;
    } catch (error) {
      console.warn("Failed to get theatres from backend, fallback to mock", error);
      if (city) {
        return MOCK_THEATRES.filter((t) => t.city.toLowerCase() === city.toLowerCase());
      }
      return MOCK_THEATRES;
    }
  },

  // GET /mba/theatre/api/v1/theatre/:theatreId
  async getTheatre(theatreId) {
    try {
      // Return mock immediately for mock IDs to avoid unnecessary API call
      if (theatreId && theatreId.startsWith("t") && theatreId.length <= 2) {
        const mock = MOCK_THEATRES.find((t) => t._id === theatreId);
        if (mock) return mock;
      }
      const response = await axiosInstance.get(`/mba/theatre/api/v1/theatre/${theatreId}`);
      const t = response.data?.data || response.data;
      return {
        ...t,
        facilities: t.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"],
      };
    } catch (error) {
      const mock = MOCK_THEATRES.find((t) => t._id === theatreId) || MOCK_THEATRES[0];
      return mock;
    }
  },

  // POST /mba/theatre/api/v1/theatre  (requires ADMIN/CLIENT auth via cookie)
  // Body: { name, description, city, pinCode, address }
  async createTheatre(theatreData) {
    try {
      const response = await axiosInstance.post("/mba/theatre/api/v1/theatre", theatreData);
      return response.data?.data || response.data;
    } catch (error) {
      const newMock = {
        _id: "t" + Date.now(),
        movies: [],
        facilities: ["Food & Beverage", "E-Ticket", "Dolby Sound"],
        ...theatreData,
      };
      MOCK_THEATRES.push(newMock);
      return newMock;
    }
  },

  /**
   * PATCH /mba/theatre/api/v1/theatre?theatreId=...  (requires ADMIN/CLIENT auth)
   * Body: fields to update (name, description, city, etc.)
   * The controller reads theatreId from req.query, not req.body.
   */
  async updateTheatre(theatreId, theatreData) {
    try {
      const response = await axiosInstance.patch(
        `/mba/theatre/api/v1/theatre?theatreId=${theatreId}`,
        theatreData
      );
      return response.data?.data || response.data;
    } catch (error) {
      const idx = MOCK_THEATRES.findIndex((t) => t._id === theatreId);
      if (idx !== -1) {
        MOCK_THEATRES[idx] = { ...MOCK_THEATRES[idx], ...theatreData };
        return MOCK_THEATRES[idx];
      }
      throw error;
    }
  },

  // DELETE /mba/theatre/api/v1/theatre/:theatreId  (requires ADMIN/CLIENT auth)
  async deleteTheatre(theatreId) {
    try {
      const response = await axiosInstance.delete(`/mba/theatre/api/v1/theatre/${theatreId}`);
      return response.data;
    } catch (error) {
      const idx = MOCK_THEATRES.findIndex((t) => t._id === theatreId);
      if (idx !== -1) {
        MOCK_THEATRES.splice(idx, 1);
        return { success: true, message: "Mock deleted" };
      }
      throw error;
    }
  },

  /**
   * PATCH /mba/theatre/api/v1/:theatreId/movies  (requires ADMIN/CLIENT auth)
   * Body: { movies: [movieId, ...], insert: true | false }
   *   insert: true  → adds the movies ($addToSet)
   *   insert: false → removes them ($pull)
   */
  async addMovieToTheatre(theatreId, movieId) {
    try {
      const response = await axiosInstance.patch(
        `/mba/theatre/api/v1/${theatreId}/movies`,
        { movies: [movieId], insert: true }
      );
      return response.data;
    } catch (error) {
      const t = MOCK_THEATRES.find((t) => t._id === theatreId);
      if (t) {
        if (!t.movies.includes(movieId)) {
          t.movies.push(movieId);
        }
        return { success: true, message: "Linked mock movie" };
      }
      throw error;
    }
  },

  /**
   * PATCH /mba/theatre/api/v1/:theatreId/movies  (requires ADMIN/CLIENT auth)
   * Body: { movies: [movieId, ...], insert: false } → removes movie from theatre
   */
  async removeMovieFromTheatre(theatreId, movieId) {
    try {
      const response = await axiosInstance.patch(
        `/mba/theatre/api/v1/${theatreId}/movies`,
        { movies: [movieId], insert: false }
      );
      return response.data;
    } catch (error) {
      const t = MOCK_THEATRES.find((t) => t._id === theatreId);
      if (t) {
        t.movies = t.movies.filter((m) => m !== movieId);
        return { success: true, message: "Removed mock movie" };
      }
      throw error;
    }
  },

  // GET /mba/theatre/api/v1/:theatreId/movies — returns theatre with populated movies array
  async getMoviesInTheatre(theatreId) {
    try {
      const response = await axiosInstance.get(`/mba/theatre/api/v1/${theatreId}/movies`);
      return response.data?.data || response.data || [];
    } catch (error) {
      const t = MOCK_THEATRES.find((t) => t._id === theatreId);
      return t ? t.movies : [];
    }
  },

  // GET /mba/theatre/api/v1/theatres/:theatreId/movies/:movieId — check if movie is in theatre
  async checkMovieInTheatre(theatreId, movieId) {
    try {
      const response = await axiosInstance.get(
        `/mba/theatre/api/v1/theatres/${theatreId}/movies/${movieId}`
      );
      return response.data?.data || response.data;
    } catch (error) {
      const t = MOCK_THEATRES.find((t) => t._id === theatreId);
      return t?.movies.includes(movieId) ? t : null;
    }
  },
};
