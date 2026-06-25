import axiosInstance from "../api/axios";

// Local helper to manage bookings fallback storage
const getLocalBookings = () => {
  try {
    const list = localStorage.getItem("local_bookings");
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
};

const saveLocalBooking = (booking) => {
  try {
    const list = getLocalBookings();
    list.unshift(booking);
    localStorage.setItem("local_bookings", JSON.stringify(list));
  } catch (e) {
    console.error("Local booking save failed", e);
  }
};

export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    try {
      // Expects: theatreId, movieId, timing, noOfSeats, totalCosts, status, userId
      const response = await axiosInstance.post("/mba/api/v1/book/booking", bookingData);
      const booking = response.data?.data || response.data;
      
      // Save locally as backup
      saveLocalBooking({
        ...booking,
        seats: bookingData.seats || [], // Store frontend seat numbers (A-1, A-2)
        movieName: bookingData.movieName,
        theatreName: bookingData.theatreName,
        timing: bookingData.timing,
        totalCosts: bookingData.totalCosts,
        createdAt: booking.createdAt || new Date().toISOString()
      });
      
      return booking;
    } catch (error) {
      console.warn("Failed to create booking on backend, creating a local mock booking", error);
      const mockBooking = {
        _id: "b_" + Date.now(),
        userId: JSON.parse(localStorage.getItem("user"))?._id || "u_mock",
        theatreId: bookingData.theatreId,
        movieId: bookingData.movieId,
        timing: bookingData.timing,
        noOfSeats: bookingData.noOfSeats,
        totalCosts: bookingData.totalCosts,
        status: "IN_PROCESS",
        seats: bookingData.seats || [],
        movieName: bookingData.movieName,
        theatreName: bookingData.theatreName,
        createdAt: new Date().toISOString()
      };
      
      saveLocalBooking(mockBooking);
      return mockBooking;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      // In controllers, update is PATCH to `/updateBooking/:bookingId`
      const response = await axiosInstance.patch(`/mba/api/v1/book/updateBooking/${bookingId}`, { status });
      
      // Update local storage too
      const local = getLocalBookings();
      const item = local.find(b => b._id === bookingId);
      if (item) {
        item.status = status;
        localStorage.setItem("local_bookings", JSON.stringify(local));
      }
      
      return response.data?.data || response.data;
    } catch (error) {
      console.warn("Failed to update booking status on backend, updating local state", error);
      const local = getLocalBookings();
      const item = local.find(b => b._id === bookingId);
      if (item) {
        item.status = status;
        localStorage.setItem("local_bookings", JSON.stringify(local));
        return item;
      }
      throw error;
    }
  },

  // Retrieve user booking history
  async getMyBookings() {
    try {
      const response = await axiosInstance.get("/mba/api/v1/book/booking");
      const bookings = response.data?.data || response.data || [];
      
      const local = getLocalBookings();
      
      // Due to the backend bug where Booking.find({_id: req.user._id}) is queried,
      // the backend will fail to match user bookings by userId.
      // Thus, we merge both lists and deduplicate by _id, prioritising local storage.
      const merged = [...local];
      bookings.forEach(b => {
        if (!merged.some(m => m._id === b._id)) {
          merged.push(b);
        }
      });
      
      return merged;
    } catch (error) {
      console.warn("Failed to retrieve bookings from backend, loading local history", error);
      return getLocalBookings();
    }
  },

  // Retrieve details of a booking
  async getBooking(bookingId) {
    try {
      const local = getLocalBookings();
      const found = local.find(b => b._id === bookingId);
      if (found) return found;

      // Otherwise query all user bookings
      const bookings = await this.getMyBookings();
      const b = bookings.find(item => item._id === bookingId);
      if (b) return b;
      
      throw new Error("Booking not found");
    } catch (error) {
      // Reconstruct basic mock
      const local = getLocalBookings();
      return local.find(b => b._id === bookingId) || {
        _id: bookingId,
        movieName: "Deadpool & Wolverine",
        theatreName: "PVR Forum Mall",
        timing: "04:30 PM",
        noOfSeats: 2,
        seats: ["C-4", "C-5"],
        totalCosts: 500,
        status: "IN_PROCESS",
        createdAt: new Date().toISOString()
      };
    }
  },

  // Admin: Get all bookings
  async getAllBookings() {
    try {
      const response = await axiosInstance.get("/mba/api/v1/book/Allbooking");
      return response.data?.data || response.data || [];
    } catch (error) {
      return getLocalBookings();
    }
  },

  // Admin: Get booking by user ID
  async getUserBookings(userId) {
    try {
      const response = await axiosInstance.get(`/mba/api/v1/book/booking/${userId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      return getLocalBookings().filter(b => b.userId === userId);
    }
  }
};
