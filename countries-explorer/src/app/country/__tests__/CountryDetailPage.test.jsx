import { render, screen, waitFor } from "@testing-library/react";
import CountryDetailPage from "../[code]/page";
import * as api from "@/lib/api";
import * as AuthContext from "@/context/AuthContext";
import { notFound } from "next/navigation";

// Mock Next.js modules
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the getCountryByCode API function
jest.mock("@/lib/api", () => ({
  getCountryByCode: jest.fn(),
}));

// Mock the Navbar and FavoriteButton components
jest.mock("@/components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock("@/components/FavoriteButton", () => {
  return function MockFavoriteButton({ country }) {
    return (
      <button data-testid="favorite-button">
        {country ? `Favorite ${country.name.common}` : "Favorite"}
      </button>
    );
  };
});

// Mock the Image component from next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt }) {
    return <img src={src} alt={alt} data-testid="country-flag" />;
  },
}));

// Mock the Link component from next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: function MockLink({ href, children, className }) {
    return (
      <a href={href} className={className} data-testid="link">
        {children}
      </a>
    );
  },
}));

// Mock the AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Sample country data
const mockCountry = {
  name: {
    common: "Germany",
    official: "Federal Republic of Germany",
  },
  population: 83190556,
  region: "Europe",
  subregion: "Western Europe",
  capital: ["Berlin"],
  flags: {
    svg: "https://example.com/germany.svg",
    png: "https://example.com/germany.png",
  },
  cca3: "DEU",
  tld: [".de"],
  currencies: {
    EUR: {
      name: "Euro",
      symbol: "€",
    },
  },
  languages: {
    deu: "German",
  },
  borders: ["AUT", "BEL", "CZE", "DNK", "FRA", "LUX", "NLD", "POL", "CHE"],
};

// Mock the React.use function
jest.spyOn(React, "use").mockImplementation((value) => value);

describe("CountryDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default AuthContext mock
    AuthContext.useAuth.mockReturnValue({
      isAuthenticated: false,
      isFavorite: () => false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    // Mock document.title to avoid errors
    Object.defineProperty(document, "title", {
      writable: true,
      value: "Countries Explorer",
    });
  });

  test("displays loading state initially", async () => {
    // Do not resolve the country data yet
    api.getCountryByCode.mockImplementation(() => new Promise(() => {}));

    render(<CountryDetailPage params={{ code: "DEU" }} />);

    // Verify loading spinner is shown (using className instead of role)
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    const loadingSpinner = document.querySelector(".animate-spin");
    expect(loadingSpinner).toBeInTheDocument();
    expect(screen.queryByText("Germany")).not.toBeInTheDocument();
  });

  test("displays country details when data is loaded", async () => {
    // Mock successful API response
    api.getCountryByCode.mockResolvedValue(mockCountry);

    render(<CountryDetailPage params={{ code: "DEU" }} />);

    // Wait for the data to load - look for the favorite button which appears after loading
    await waitFor(() => {
      expect(screen.getByTestId("favorite-button")).toBeInTheDocument();
    });

    // Verify country data is displayed
    expect(screen.getByText(/Germany/)).toBeInTheDocument();
    expect(screen.getByText(/Federal Republic of Germany/)).toBeInTheDocument();
    expect(screen.getByText(/83,190,556/)).toBeInTheDocument();
    expect(screen.getByText(/Europe/)).toBeInTheDocument();
    expect(screen.getByText(/Berlin/)).toBeInTheDocument();
    expect(screen.getByText(/German/)).toBeInTheDocument();
    expect(screen.getByText(/Euro/)).toBeInTheDocument();
    expect(screen.getByText(/€/)).toBeInTheDocument();

    // Verify flag is displayed
    const flag = screen.getByTestId("country-flag");
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute("src", mockCountry.flags.svg);

    // Verify border countries are displayed
    mockCountry.borders.forEach((border) => {
      expect(screen.getByText(border)).toBeInTheDocument();
    });
  });

  test("calls notFound when country is not found", async () => {
    // Mock API returning null (country not found)
    api.getCountryByCode.mockResolvedValue(null);

    render(<CountryDetailPage params={{ code: "XYZ" }} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  test("displays country with missing optional data", async () => {
    // Create a country with missing optional fields
    const incompleteCountry = {
      ...mockCountry,
      subregion: undefined,
      capital: undefined,
      tld: undefined,
      currencies: undefined,
      languages: undefined,
      borders: undefined,
    };

    api.getCountryByCode.mockResolvedValue(incompleteCountry);

    render(<CountryDetailPage params={{ code: "DEU" }} />);

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByTestId("favorite-button")).toBeInTheDocument();
    });

    // Verify "None" is displayed for missing fields
    // Check that "None" appears in the document and is associated with the right fields
    const noneTexts = screen.getAllByText("None");
    expect(noneTexts.length).toBeGreaterThanOrEqual(4); // At least 4 "None" values

    // Verify border countries section is not displayed
    expect(screen.queryByText("Border Countries:")).not.toBeInTheDocument();
  });

  test("updates document title when country is loaded", async () => {
    api.getCountryByCode.mockResolvedValue(mockCountry);

    render(<CountryDetailPage params={{ code: "DEU" }} />);

    // Wait for the data to load
    await waitFor(() => {
      expect(document.title).toBe("Germany - Countries Explorer");
    });
  });
});
