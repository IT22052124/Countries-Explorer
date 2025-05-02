import { render, screen, fireEvent } from "@testing-library/react";
import RegionFilter from "../RegionFilter";

describe("RegionFilter", () => {
  test("renders select with all region options", () => {
    render(<RegionFilter onFilterChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
  });

  test("calls onFilterChange when a region is selected", () => {
    const mockOnFilterChange = jest.fn();
    render(<RegionFilter onFilterChange={mockOnFilterChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Europe" } });
    expect(mockOnFilterChange).toHaveBeenCalledWith("Europe");
  });

  test("calls onFilterChange with empty string when 'All' is selected", () => {
    const mockOnFilterChange = jest.fn();
    render(<RegionFilter onFilterChange={mockOnFilterChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "" } });
    expect(mockOnFilterChange).toHaveBeenCalledWith("");
  });
});
