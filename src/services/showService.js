import axiosInstance from "../api/axios";

export const showService = {
  // Get shows for a movie and/or theatre
  async getShows(theatreId, movieId) {
    const response = await axiosInstance.get("/mba/api/v1/show/getShows", {
      params: { theatreId, movieId }
    });
    return response.data?.data || response.data || [];
  },

  // Get only the shows owned by the authenticated client
  async getMyShows() {
    const response = await axiosInstance.get("/mba/api/v1/show/getMyShows", {
      withCredentials: true,
    });
    return response.data?.data || response.data || [];
  },


  // Get a single show details
  async getShowById(showId) {
    // The backend doesn't have a direct GET /show/:id endpoint, but we can query all shows and filter
    const response = await axiosInstance.get("/mba/api/v1/show/getShows");
    const shows = response.data?.data || response.data || [];
    const show = shows.find(s => s._id === showId);
    if (!show) {
      throw new Error("Show not found");
    }
    return show;
  },

  // Create show (Admin)
  async createShow(showData) {
    const response = await axiosInstance.post("/mba/api/v1/show/createShow", showData);
    return response.data?.data || response.data;
  },

  // Update show (Admin)
  async updateShow(showId, showData) {
    const response = await axiosInstance.patch(`/mba/api/v1/show/updateShow/${showId}`, showData);
    return response.data?.data || response.data;
  },

  // Delete show (Admin)
  async deleteShow(showId) {
    const response = await axiosInstance.delete("/mba/api/v1/show/deleteShow", {
      params: { showId }
    });
    return response.data;
  }
};
