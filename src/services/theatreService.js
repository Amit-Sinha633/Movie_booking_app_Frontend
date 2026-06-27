import axiosInstance from "../api/axios";

export const theatreService = {
  // GET /mba/theatre/api/v1/theatres?city=...&movieId=...
  async getTheatres(city = "") {
    const params = {};
    if (city) params.city = city; // preserve exact casing to match DB values

    const response = await axiosInstance.get("/mba/theatre/api/v1/theatres", { params });
    const theatres = response.data?.data || response.data || [];

    // Inject facilities if missing (backend doesn't have this field)
    return theatres.map((t) => ({
      ...t,
      facilities: t.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"],
    }));
  },

  // GET /mba/theatre/api/v1/myTheatres (requires auth)
  async getMyTheatres() {
    const response = await axiosInstance.get("/mba/theatre/api/v1/myTheatres", {
      withCredentials: true,
    });
    const theatres = response.data?.data || response.data || [];
    return theatres.map((t) => ({
      ...t,
      facilities: t.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"],
    }));
  },

  // GET /mba/theatre/api/v1/theatre/:theatreId
  async getTheatre(theatreId) {
    const response = await axiosInstance.get(`/mba/theatre/api/v1/theatre/${theatreId}`);
    const t = response.data?.body || response.data?.data || response.data;
    return {
      ...t,
      facilities: t?.facilities || ["Food & Beverage", "E-Ticket", "Dolby Sound"],
    };
  },

  // POST /mba/theatre/api/v1/theatre  (requires ADMIN/CLIENT auth via cookie)
  // Body: { name, description, city, pinCode, address }
  async createTheatre(theatreData) {
    const response = await axiosInstance.post("/mba/theatre/api/v1/theatre", theatreData);
    return response.data?.data || response.data;
  },

  /**
   * PATCH /mba/theatre/api/v1/theatre?theatreId=...  (requires ADMIN/CLIENT auth)
   * Body: fields to update (name, description, city, etc.)
   * The controller reads theatreId from req.query, not req.body.
   */
  async updateTheatre(theatreId, theatreData) {
    const response = await axiosInstance.patch(
      `/mba/theatre/api/v1/theatre?theatreId=${theatreId}`,
      theatreData
    );
    return response.data?.data || response.data;
  },

  // DELETE /mba/theatre/api/v1/theatre/:theatreId  (requires ADMIN/CLIENT auth)
  async deleteTheatre(theatreId) {
    const response = await axiosInstance.delete(`/mba/theatre/api/v1/theatre/${theatreId}`);
    return response.data;
  },

  /**
   * PATCH /mba/theatre/api/v1/:theatreId/movies  (requires ADMIN/CLIENT auth)
   * Body: { movies: [movieId, ...], insert: true | false }
   *   insert: true  → adds the movies ($addToSet)
   *   insert: false → removes them ($pull)
   */
  async addMovieToTheatre(theatreId, movieId) {
    const response = await axiosInstance.patch(
      `/mba/theatre/api/v1/${theatreId}/movies`,
      { movies: [movieId], insert: true }
    );
    return response.data;
  },

  /**
   * PATCH /mba/theatre/api/v1/:theatreId/movies  (requires ADMIN/CLIENT auth)
   * Body: { movies: [movieId, ...], insert: false } → removes movie from theatre
   */
  async removeMovieFromTheatre(theatreId, movieId) {
    const response = await axiosInstance.patch(
      `/mba/theatre/api/v1/${theatreId}/movies`,
      { movies: [movieId], insert: false }
    );
    return response.data;
  },

  // GET /mba/theatre/api/v1/:theatreId/movies — returns theatre with populated movies array
  async getMoviesInTheatre(theatreId) {
    const response = await axiosInstance.get(`/mba/theatre/api/v1/${theatreId}/movies`);
    return response.data?.data || response.data || [];
  },

  // GET /mba/theatre/api/v1/theatres/:theatreId/movies/:movieId — check if movie is in theatre
  async checkMovieInTheatre(theatreId, movieId) {
    const response = await axiosInstance.get(
      `/mba/theatre/api/v1/theatres/${theatreId}/movies/${movieId}`
    );
    return response.data?.data || response.data;
  },
};
