"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  resetTheme: () => {},
  clearThemeSettings: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  // Apply theme to document (client-side only)
  const applyTheme = (newTheme) => {
    if (typeof document !== "undefined") {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      // Also set a data attribute for additional styling options
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  // Initialize theme (client-side only)
  useEffect(() => {
    setIsMounted(true);
    // Check for saved theme
    const savedTheme = localStorage.getItem("theme");

    // Apply theme based on localStorage or system preference
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      applyTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      // Ensure light theme is applied if that's the default
      applyTheme("light");
      localStorage.setItem("theme", "light");
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't explicitly set a preference
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
