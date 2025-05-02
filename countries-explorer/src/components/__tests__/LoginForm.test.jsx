import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";

describe("LoginForm Component", () => {
  const mockOnSubmit = jest.fn();
  const mockSwitchToRegister = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test("renders login form with email and password fields", () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        error=""
        switchToRegister={mockSwitchToRegister}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("displays error message when provided", () => {
    const errorMessage = "Invalid credentials";

    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        error={errorMessage}
        switchToRegister={mockSwitchToRegister}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("updates form data when input values change", () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        error=""
        switchToRegister={mockSwitchToRegister}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("calls onSubmit with form data when form is submitted", async () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        error=""
        switchToRegister={mockSwitchToRegister}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("calls switchToRegister when create account button is clicked", () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        error=""
        switchToRegister={mockSwitchToRegister}
      />
    );

    const switchButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.click(switchButton);

    expect(mockSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  test("shows loading state during form submission", async () => {
    // Mock implementation that doesn't immediately resolve
    const mockSubmitWithLoading = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(true), 100);
        })
    );

    render(
      <LoginForm
        onSubmit={mockSubmitWithLoading}
        error=""
        switchToRegister={mockSwitchToRegister}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    // Should show loading state
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });
});
