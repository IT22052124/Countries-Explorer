import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  test("renders correctly", () => {
    render(<SearchBar onSearch={() => {}} />);

    // Check that search input is rendered
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    expect(searchInput).toBeInTheDocument();
  });

  test("calls onSearch when input changes", async () => {
    // Create a mock function for the onSearch prop
    const mockOnSearch = jest.fn();

    render(<SearchBar onSearch={mockOnSearch} />);

    // Get the search input
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);

    // Simulate typing in the search box
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Wait for debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("test");
    });
  });

  test("clears the input when the clear button is clicked", async () => {
    // Create a mock function for the onSearch prop
    const mockOnSearch = jest.fn();

    render(<SearchBar onSearch={mockOnSearch} />);

    // Get the search input
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);

    // Simulate typing in the search box
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Wait for debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("test");
    });

    // Find and click the clear button
    const clearButton = screen.getByLabelText(/clear search/i);
    fireEvent.click(clearButton);

    // Check if the input is cleared
    expect(searchInput.value).toBe("");

    // Check if the onSearch function was called with an empty string
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});
