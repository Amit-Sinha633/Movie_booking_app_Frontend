import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, restore user from localStorage if a prior session existed.
    // The actual JWT is in an httpOnly cookie — the browser sends it automatically.
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error restoring auth state", err);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.signIn(credentials);
      setUser(data.user);
      toast.success("Welcome back!");
      return data.user;
    } catch (error) {
      const errMsg =
        error?.err || error?.message || "Failed to sign in. Please check your credentials.";
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.signUp(userData);
      toast.success("Account created successfully! Please Sign In.");
      return response;
    } catch (error) {
      const errMsg = error?.err || error?.msg || error?.message || "Registration failed";
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      // Even if the server call fails, clear the local state
    } finally {
      setUser(null);
      toast.success("Signed out successfully.");
    }
  };

  const updateProfile = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.userRole === "ADMIN";
  // CLIENT and ADMIN both have write access to movies/theatres/shows
  const isClient = user?.userRole === "CLIENT" || user?.userRole === "ADMIN";

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isClient,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
