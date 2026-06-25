import axiosInstance from "../api/axios";

export const authService = {
  /**
   * POST /mba/api/v1/auth/signUp
   * Body: { name, email, password, userRole? }
   * The backend sets httpOnly cookies (accessToken, refreshToken) on success.
   */
  async signUp(userData) {
    const response = await axiosInstance.post("/mba/api/v1/auth/signUp", userData);
    return response.data;
  },

  /**
   * POST /mba/api/v1/auth/signIn
   * Body: { email, password }
   * On success the backend sets httpOnly cookies automatically.
   * We store only the user object (no token) in localStorage for UI hydration.
   */
  async signIn(credentials) {
    const response = await axiosInstance.post("/mba/api/v1/auth/signIn", credentials);
    const userData = response.data?.data || response.data;

    // Persist user info for UI (e.g. name, role) — NOT the token.
    // The actual JWT is in an httpOnly cookie managed by the browser.
    localStorage.setItem("user", JSON.stringify(userData));

    return { user: userData };
  },

  /**
   * POST /mba/api/v1/auth/signOut  (requires verifyJwt — cookie sent automatically)
   * Clears the cookie on the server side and removes user from localStorage.
   */
  async signOut() {
    try {
      await axiosInstance.post("/mba/api/v1/auth/signOut");
    } catch (error) {
      console.warn("SignOut server request failed, clearing client state anyway.", error);
    } finally {
      localStorage.removeItem("user");
    }
  },

  /**
   * PATCH /mba/api/v1/auth/resetPassword  (requires verifyJwt)
   * Body: { oldPassword, newPassword }
   */
  async resetPassword(passwords) {
    const response = await axiosInstance.patch("/mba/api/v1/auth/resetPassword", passwords);
    return response.data;
  },
};
