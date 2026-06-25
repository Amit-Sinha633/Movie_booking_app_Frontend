import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error restoring auth state", err);
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
      const errMsg = error.err || error.message || "Failed to sign in";
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
      const errMsg = error.err || error.message || "Registration failed";
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success("Signed out successfully.");
    } catch (error) {
      setUser(null);
    }
  };

  const updateProfile = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.userRole === "ADMIN";
  const isClient = user?.userRole === "CLIENT" || user?.userRole === "ADMIN"; // client or admin both have editing access in some fields

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isClient,
    login,
    register,
    logout,
    updateProfile
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
