"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthenticated,
  getCurrentUser,
  login,
  register,
  logout,
} from "@/lib/authApi";
import Modal from "@/components/Modal";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { getFavorites } from "@/lib/favoritesApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            // If getCurrentUser returns null, clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error getting current user:", error);
          // Clear local storage on error
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Load user favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated() && user) {
        setFavoritesLoading(true);
        try {
          const response = await getFavorites();
          setFavorites(response.data || []);
        } catch (error) {
          console.error("Failed to load favorites:", error);
        } finally {
          setFavoritesLoading(false);
        }
      } else {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  // Redirect if accessing protected routes when not authenticated
  useEffect(() => {
    if (!loading && !user && !isLoggingOut) {
      if (pathname === "/profile" || pathname.includes("/favorites")) {
        router.push("/");
      }
    }
  }, [loading, user, pathname, router, isLoggingOut]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    setAuthError("");
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
    setAuthError("");
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setAuthError("");
  };

  const handleLogin = async (credentials) => {
    setAuthError("");
    try {
      const response = await login(credentials);
      setUser(response.user);
      closeModals();
      return true;
    } catch (error) {
      setAuthError(
        error.response?.data?.message || "Failed to login. Please try again."
      );
      return false;
    }
  };

  const handleRegister = async (userData) => {
    setAuthError("");
    try {
      const response = await register(userData);
      setUser(response.user);
      closeModals();
      return true;
    } catch (error) {
      setAuthError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      return false;
    }
  };

  const handleLogout = async () => {
    // Preserve the current theme
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    // Set logging out state to prevent premature redirects
    setIsLoggingOut(true);

    try {
      await logout();

      // Redirect first before clearing user state to prevent flash
      if (pathname === "/profile" || pathname.includes("/favorites")) {
        await router.push("/");
      }

      // Small delay to ensure navigation completes before state changes
      setTimeout(() => {
        setUser(null);
        setFavorites([]);
        setIsLoggingOut(false);

        // Re-apply theme to prevent white flash
        if (currentTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);

      // Handle error case
      if (pathname === "/profile" || pathname.includes("/favorites")) {
        await router.push("/");
      }

      // Small delay to ensure navigation completes
      setTimeout(() => {
        setUser(null);
        setFavorites([]);
        setIsLoggingOut(false);

        // Re-apply theme to prevent white flash
        if (currentTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      }, 100);
    }
  };

  // Add a favorite to the local state
  const addToFavorites = (favorite) => {
    // Check if favorite already exists
    if (favorites.some((fav) => fav.countryCode === favorite.countryCode)) {
      return; // Don't add if already exists
    }
    setFavorites((prev) => [...prev, favorite]);
  };

  // Remove a favorite from the local state
  const removeFromFavorites = (countryCode) => {
    setFavorites((prev) =>
      prev.filter((fav) => fav.countryCode !== countryCode)
    );
  };

  // Check if a country is favorited
  const isFavorite = (countryCode) => {
    return favorites.some((fav) => fav.countryCode === countryCode);
  };

  // The value that will be available to components using this context
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    isLoggingOut,
    openLoginModal,
    openRegisterModal,
    handleLogin,
    handleRegister,
    handleLogout,
    authError,
    favorites,
    favoritesLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={closeModals} title="Login">
        <LoginForm
          onSubmit={handleLogin}
          error={authError}
          switchToRegister={openRegisterModal}
        />
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={closeModals}
        title="Create an account"
      >
        <RegisterForm
          onSubmit={handleRegister}
          error={authError}
          switchToLogin={openLoginModal}
        />
      </Modal>
    </AuthContext.Provider>
  );
};
