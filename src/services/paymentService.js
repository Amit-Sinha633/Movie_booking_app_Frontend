import axiosInstance from "../api/axios";

export const paymentService = {
  // Process payment for a booking
  async createPayment(bookingId, amount) {
    // Backend expects amount and showId in body
    const response = await axiosInstance.post(`/mba/api/v1/payment/createPayment/${bookingId}`, {
      amount
    });
    return response.data?.data || response.data;
  },

  // Get details of a single payment
  async getPaymentDetails(paymentId) {
    const response = await axiosInstance.get(`/mba/api/v1/payment/payment/${paymentId}`);
    return response.data?.data || response.data;
  },

  // Admin: Get all payment histories
  async getAllPayments() {
    const response = await axiosInstance.get("/mba/api/v1/payment/all-payments");
    return response.data?.data || response.data || [];
  }
};
