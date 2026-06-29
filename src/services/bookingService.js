import axiosInstance from "../api/axios";

export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    // Expects: theatreId, movieId, timing, noOfSeats, totalCosts, status, userId
    const response = await axiosInstance.post("/mba/api/v1/book/booking", bookingData);
    return response.data?.data || response.data;
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    // In controllers, update is PATCH to `/updateBooking/:bookingId`
    const response = await axiosInstance.patch(`/mba/api/v1/book/updateBooking/${bookingId}`, { status });
    return response.data?.data || response.data;
  },

  // Retrieve user booking history
  async getMyBookings() {
    const response = await axiosInstance.get("/mba/api/v1/book/booking");
    console.log(response)
    return response.data?.data || response.data || [];
  },

  // Retrieve logged-in user booking history
  async getUserBookingHistory() {
    const response = await axiosInstance.get("/mba/api/v1/book/userBookingHistory");
    console.log("User Booking History Response:", response.data);
    return response.data?.data || response.data || [];
  },

  // Retrieve details of a booking
  async getBooking(bookingId) {
    // Query all user bookings and filter
    const bookings = await this.getMyBookings();
    const b = bookings.find(item => item._id === bookingId);
    if (!b) {
      throw new Error("Booking not found");
    }
    return b;
  },

  // Admin: Get all bookings
  async getAllBookings() {
    const response = await axiosInstance.get("/mba/api/v1/book/Allbooking");
    return response.data?.data || response.data || [];
  },

  // Admin: Get booking by user ID
  async getUserBookings(userId) {
    const response = await axiosInstance.get(`/mba/api/v1/book/booking/${userId}`);
    return response.data?.data || response.data || [];
  }
};
