import axiosInstance from "../api/axios";

export const authService = {
  async signUp(userData) {
    try {
      // Backend expects: name, email, password, and optional userRole/userStatus
      const response = await axiosInstance.post("/mba/api/v1/auth/signUp", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async signIn(credentials) {
    try {
      // Backend expects: email, password
      const response = await axiosInstance.post("/mba/api/v1/auth/signIn", credentials);
      
      // The backend returns successResponse with cookie but since we're using REST frontend, 
      // let's grab the token from headers or response data if present.
      // Wait, in auth.controller.js line 66, it returns successResponse with data = existingUser.
      // Let's check how the cookie is handled. If it's httpOnly cookie, the browser handles it automatically.
      // However, we'll store user data in LocalStorage. If the backend passes the token in data or if we mock it,
      // let's save the accessToken.
      const userData = response.data?.data || response.data;
      
      // Let's check if the response includes a token (if not, we can generate a mock token for frontend state keeping)
      const token = response.data?.accessToken || userData?.token || "mock-jwt-token-" + Math.random().toString(36).substr(2);
      
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return { user: userData, token };
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  async signOut() {
    try {
      await axiosInstance.post("/mba/api/v1/auth/signOut");
    } catch (error) {
      console.warn("SignOut request failed on server, clearing client storage anyway", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },

  async resetPassword(passwords) {
    try {
      // Backend expects: oldPassword, newPassword
      const response = await axiosInstance.patch("/mba/api/v1/auth/resetPassword", passwords);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
