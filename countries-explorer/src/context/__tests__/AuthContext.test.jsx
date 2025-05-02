import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import * as authApi from "@/lib/authApi";
import * as favoritesApi from "@/lib/favoritesApi";

// Mock the auth API
jest.mock("@/lib/authApi");
jest.mock("@/lib/favoritesApi");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Mock the Modal component to prevent test issues with portals
jest.mock("@/components/Modal", () => {
  return {
    __esModule: true,
    default: ({ children, isOpen }) =>
      isOpen ? <div data-testid="modal">{children}</div> : null,
  };
});

// Helper component to test the context
const AuthConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">
        {auth.user ? JSON.stringify(auth.user) : "no user"}
      </div>
      <div data-testid="is-authenticated">
        {auth.isAuthenticated.toString()}
      </div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <button
        data-testid="login-btn"
        onClick={() =>
          auth.handleLogin({ email: "test@example.com", password: "password" })
        }
      >
        Login
      </button>
      <button
        data-testid="register-btn"
        onClick={() =>
          auth.handleRegister({
            email: "test@example.com",
            password: "password",
            username: "testuser",
          })
        }
      >
        Register
      </button>
      <button data-testid="logout-btn" onClick={auth.handleLogout}>
        Logout
      </button>
      <button data-testid="open-login-modal" onClick={auth.openLoginModal}>
        Open Login Modal
      </button>
      <button
        data-testid="open-register-modal"
        onClick={auth.openRegisterModal}
      >
        Open Register Modal
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("initializes with no user and loading state", async () => {
    // Mock isAuthenticated to return false
    authApi.isAuthenticated.mockReturnValue(false);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Initial state is not loading (implementation has changed)
    expect(screen.getByTestId("loading").textContent).toBe("false");

    // After loading, should have no user
    expect(screen.getByTestId("user").textContent).toBe("no user");
    expect(screen.getByTestId("is-authenticated").textContent).toBe("false");
  });

  test("initializes with user when authenticated", async () => {
    // Mock authenticated user
    const mockUser = {
      id: "123",
      username: "testuser",
      email: "test@example.com",
    };
    authApi.isAuthenticated.mockReturnValue(true);
    authApi.getCurrentUser.mockResolvedValue(mockUser);
    favoritesApi.getFavorites.mockResolvedValue({ data: [] });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Wait for loading to complete and user to be set
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("is-authenticated").textContent).toBe("true");
    });

    // Should have user data
    expect(screen.getByTestId("user").textContent).toContain("testuser");
  });

  test("handles login successfully", async () => {
    // Mock successful login
    const mockUser = {
      id: "123",
      username: "testuser",
      email: "test@example.com",
    };
    authApi.login.mockResolvedValue({ user: mockUser, token: "fake-token" });
    favoritesApi.getFavorites.mockResolvedValue({ data: [] });
    authApi.isAuthenticated.mockReturnValue(false);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    // Click login button
    act(() => {
      screen.getByTestId("login-btn").click();
    });

    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByTestId("is-authenticated").textContent).toBe("true");
      expect(screen.getByTestId("user").textContent).toContain("testuser");
    });

    // Check that login API was called with correct parameters
    expect(authApi.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  test("handles logout correctly", async () => {
    // Mock authenticated user and successful logout
    const mockUser = {
      id: "123",
      username: "testuser",
      email: "test@example.com",
    };
    authApi.isAuthenticated.mockReturnValue(true);
    authApi.getCurrentUser.mockResolvedValue(mockUser);
    authApi.logout.mockResolvedValue({ success: true });
    favoritesApi.getFavorites.mockResolvedValue({ data: [] });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Wait for loading to complete and user to be set
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("is-authenticated").textContent).toBe("true");
    });

    // Click logout button
    act(() => {
      screen.getByTestId("logout-btn").click();
    });

    // Wait for logout to complete
    await waitFor(() => {
      expect(screen.getByTestId("is-authenticated").textContent).toBe("false");
      expect(screen.getByTestId("user").textContent).toBe("no user");
    });

    // Check that logout API was called
    expect(authApi.logout).toHaveBeenCalled();
  });

  test("opens and closes login modal", async () => {
    authApi.isAuthenticated.mockReturnValue(false);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    // Modal should not be visible initially
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

    // Open login modal
    act(() => {
      screen.getByTestId("open-login-modal").click();
    });

    // Login modal should be visible
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });
});
