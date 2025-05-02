import { render, screen } from "@testing-library/react";
import CountryCard from "../CountryCard";
import { AuthProvider } from "@/context/AuthContext";
import * as AuthContext from "@/context/AuthContext";

// Mock the favoritesApi module
jest.mock("@/lib/favoritesApi", () => ({
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  checkFavorite: jest.fn().mockResolvedValue({ isFavorite: false }),
}));

const mockCountry = {
  name: { common: "Test Country" },
  population: 1000000,
  region: "Test Region",
  capital: ["Test Capital"],
  flags: {
    svg: "https://example.com/flag.svg",
    png: "https://example.com/flag.png",
  },
  cca3: "TST",
};

describe("CountryCard", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("renders country information correctly", () => {
    // Mock useAuth to avoid context error
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      openLoginModal: jest.fn(),
      isFavorite: () => false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });
    render(<CountryCard country={mockCountry} />);

    // Check that country name is rendered
    expect(screen.getByText("Test Country")).toBeInTheDocument();

    // Check that population is rendered
    expect(screen.getByText(/1,000,000/)).toBeInTheDocument();

    // Check that region is rendered
    expect(screen.getByText(/Test Region/)).toBeInTheDocument();

    // Check that capital is rendered
    expect(screen.getByText(/Test Capital/)).toBeInTheDocument();
  });

  test("does not show favorite button when not logged in", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      openLoginModal: jest.fn(),
      isFavorite: () => false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });
    render(<CountryCard country={mockCountry} />);

    // There should be no favorite button visible when not logged in
    const favoriteButtons = screen.queryByLabelText(
      /Add to favorites|Remove from favorites/
    );
    expect(favoriteButtons).not.toBeInTheDocument();
  });

  test("includes a link to the country detail page", () => {
    jest.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated: false,
      openLoginModal: jest.fn(),
      isFavorite: () => false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });
    render(<CountryCard country={mockCountry} />);

    // Look for a link with the country code in the href
    const link = document.querySelector(`a[href="/country/TST"]`);
    expect(link).toBeInTheDocument();
  });
});
