import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Allow cookies to be sent with requests
});

// Add token to all requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all favorites for the current user
export const getFavorites = async () => {
  try {
    const response = await api.get("/favorites");
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Add a country to favorites
export const addFavorite = async (countryData) => {
  try {
    const response = await api.post("/favorites", countryData);
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// Remove a country from favorites
export const removeFavorite = async (countryCode) => {
  try {
    const response = await api.delete(`/favorites/${countryCode}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

// Check if a country is in favorites
export const checkFavorite = async (countryCode) => {
  try {
    const response = await api.get(`/favorites/${countryCode}`);
    return response.data;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    throw error;
  }
};
