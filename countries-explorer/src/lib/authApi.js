import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Allow cookies to be sent with requests
});

// Helper functions for token management
const saveToken = (token) => {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
  }
};

const saveUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

const clearAuth = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error clearing auth data from localStorage:", error);
  }
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    if (response.data.token) {
      saveToken(response.data.token);
      saveUser(response.data.user);
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login a user
export const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);

    if (response.data.token) {
      saveToken(response.data.token);
      saveUser(response.data.user);
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout a user
export const logout = async () => {
  try {
    await api.get("/auth/logout");
    clearAuth();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove the token and user even if the API call fails
    clearAuth();
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.user) {
      clearAuth();
      return null;
    }

    return response.data.user;
  } catch (error) {
    console.error("Get current user error:", error);
    // If token is invalid, clear local storage
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      clearAuth();
    }
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    return !!localStorage.getItem("token");
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};
