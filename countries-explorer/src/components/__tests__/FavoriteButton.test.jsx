import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoriteButton from "../FavoriteButton";
import * as AuthContext from "@/context/AuthContext";
import * as favoritesApi from "@/lib/favoritesApi";

// Mock the favoritesApi and AuthContext
jest.mock("@/lib/favoritesApi");
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("FavoriteButton Component", () => {
  const mockCountry = {
    name: { common: "Test Country" },
    cca3: "TST",
    flags: {
      svg: "https://example.com/flag.svg",
      png: "https://example.com/flag.png",
    },
  };

  const mockAuthContext = {
    isAuthenticated: true,
    openLoginModal: jest.fn(),
    isFavorite: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for AuthContext
    AuthContext.useAuth.mockReturnValue(mockAuthContext);

    // Default mock implementation for isFavorite
    mockAuthContext.isFavorite.mockReturnValue(false);

    // Default mock implementations for API functions
    favoritesApi.addFavorite.mockResolvedValue({ success: true });
    favoritesApi.removeFavorite.mockResolvedValue({ success: true });
  });

  test("renders nothing when user is not authenticated", () => {
    // Mock not authenticated
    AuthContext.useAuth.mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: false,
    });

    render(<FavoriteButton country={mockCountry} />);

    // Component should not render anything
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders nothing when no country is provided", () => {
    render(<FavoriteButton country={null} />);

    // Component should not render anything
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders unfilled heart icon when country is not favorited", () => {
    // Mock not favorited
    mockAuthContext.isFavorite.mockReturnValue(false);

    render(<FavoriteButton country={mockCountry} />);

    // Button should be rendered
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Icon should have "fill=none" attribute
    const icon = button.querySelector("svg");
    expect(icon).toHaveAttribute("fill", "none");
  });

  test("renders filled heart icon when country is favorited", () => {
    // Mock favorited
    mockAuthContext.isFavorite.mockReturnValue(true);

    render(<FavoriteButton country={mockCountry} />);

    // Button should be rendered
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Icon should have "fill=currentColor" attribute
    const icon = button.querySelector("svg");
    expect(icon).toHaveAttribute("fill", "currentColor");
  });

  test("opens login modal when not authenticated user clicks the button", () => {
    // Mock not authenticated
    AuthContext.useAuth.mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: false,
      openLoginModal: jest.fn(),
    });

    render(<FavoriteButton country={mockCountry} />);

    // Component should not render anything
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("adds country to favorites when clicked and not already favorited", async () => {
    // Mock not favorited
    mockAuthContext.isFavorite.mockReturnValue(false);

    render(<FavoriteButton country={mockCountry} />);

    // Click the favorite button
    fireEvent.click(screen.getByRole("button"));

    // Verify optimistic UI update
    expect(mockAuthContext.addToFavorites).toHaveBeenCalledWith({
      countryCode: "TST",
      countryName: "Test Country",
      flagUrl: "https://example.com/flag.svg",
    });

    // Verify API call
    await waitFor(() => {
      expect(favoritesApi.addFavorite).toHaveBeenCalledWith({
        countryCode: "TST",
        countryName: "Test Country",
        flagUrl: "https://example.com/flag.svg",
      });
    });
  });

  test("removes country from favorites when clicked and already favorited", async () => {
    // Mock favorited
    mockAuthContext.isFavorite.mockReturnValue(true);

    render(<FavoriteButton country={mockCountry} />);

    // Click the favorite button
    fireEvent.click(screen.getByRole("button"));

    // Verify optimistic UI update
    expect(mockAuthContext.removeFromFavorites).toHaveBeenCalledWith("TST");

    // Verify API call
    await waitFor(() => {
      expect(favoritesApi.removeFavorite).toHaveBeenCalledWith("TST");
    });
  });

  test("handles error when adding to favorites fails", async () => {
    // Mock not favorited
    mockAuthContext.isFavorite.mockReturnValue(false);

    // Mock API error
    const error = new Error("API error");
    favoritesApi.addFavorite.mockRejectedValue(error);

    // Mock console.error to prevent test output pollution
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<FavoriteButton country={mockCountry} />);

    // Click the favorite button
    fireEvent.click(screen.getByRole("button"));

    // Verify optimistic UI update
    expect(mockAuthContext.addToFavorites).toHaveBeenCalled();

    // Verify error handling and reversion
    await waitFor(() => {
      expect(favoritesApi.addFavorite).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to toggle favorite:",
        error
      );
      expect(mockAuthContext.removeFromFavorites).toHaveBeenCalledWith("TST");
    });
  });

  test("handles error when removing from favorites fails", async () => {
    // Mock favorited
    mockAuthContext.isFavorite.mockReturnValue(true);

    // Mock API error
    const error = new Error("API error");
    favoritesApi.removeFavorite.mockRejectedValue(error);

    // Mock console.error to prevent test output pollution
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<FavoriteButton country={mockCountry} />);

    // Click the favorite button
    fireEvent.click(screen.getByRole("button"));

    // Verify optimistic UI update
    expect(mockAuthContext.removeFromFavorites).toHaveBeenCalled();

    // Verify error handling and reversion
    await waitFor(() => {
      expect(favoritesApi.removeFavorite).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to toggle favorite:",
        error
      );
      expect(mockAuthContext.addToFavorites).toHaveBeenCalled();
    });
  });

  test("button is disabled during loading state", async () => {
    // Mock slow API response to catch loading state
    favoritesApi.addFavorite.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100)
        )
    );

    render(<FavoriteButton country={mockCountry} />);

    // Click the favorite button
    fireEvent.click(screen.getByRole("button"));

    // Button should be disabled during loading
    expect(screen.getByRole("button")).toBeDisabled();

    // Icon should have animate-pulse class during loading
    const icon = screen.getByRole("button").querySelector("svg");
    expect(icon).toHaveClass("animate-pulse");

    // Wait for loading to complete
    await waitFor(() => {
      expect(favoritesApi.addFavorite).toHaveBeenCalled();
    });
  });
});
