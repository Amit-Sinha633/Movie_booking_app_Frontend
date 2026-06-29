import axiosInstance from "../api/axios";

export const userService = {
  // Update user role or status (Admin only)
  async updateRoleOrStatus(userId,updateData) {
    // Backend expects body: { userRole, userStatus }
    const response = await axiosInstance.patch(
      `/mba/api/v1/user/updateRoleOrStatusOfUser/${userId}`,
      updateData
    );
    return response.data?.data || response.data;
  },

  // Get all users (Backend does not support this, returning empty array)
  async getAllUsers() {
    const response = await axiosInstance.get(
    "/mba/api/v1/user/getAllUsers"
  );
  return response.data?.data || response.data;
  },

  // Delete a user
  async deleteUser(userId) {
    const response = await axiosInstance.delete(
      `/mba/api/v1/user/deleteUser/${userId}`
    );
    return response.data?.data || response.data;
  }
};
