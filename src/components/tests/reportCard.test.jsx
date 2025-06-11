import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ReportCard from "../ReportCard";

// react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// wrapper for routing context
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

const mockReport = {
  id: "test-report-123",
  location: "123 Main St, Chicago, IL",
  time: "2024-06-01T14:30:00Z",
  notes: "test note",
  emergencyNames: ["Children Involved"],
};

describe("ReportCard - View Details Navigation", () => {
  let mockOnViewDetails;

  beforeEach(() => {
    mockOnViewDetails = vi.fn();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render report card with basic information", () => {
    render(
      <TestWrapper>
        <ReportCard report={mockReport} onViewDetails={mockOnViewDetails} />
      </TestWrapper>
    );

    expect(screen.getByText("123 Main St, Chicago, IL")).toBeTruthy();
    expect(screen.getByText("6/1/2024")).toBeTruthy();
    expect(screen.getByText("test note")).toBeTruthy();
  });

  it("should display emergencies when present", () => {
    render(
      <TestWrapper>
        <ReportCard report={mockReport} onViewDetails={mockOnViewDetails} />
      </TestWrapper>
    );

    expect(screen.getByText("Emergencies")).toBeTruthy();
  });

  it("should render View Details button", () => {
    render(
      <TestWrapper>
        <ReportCard report={mockReport} onViewDetails={mockOnViewDetails} />
      </TestWrapper>
    );

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    expect(viewDetailsButton).toBeTruthy();
  });

  it("should call onViewDetails when View Details button is clicked", () => {
    render(
      <TestWrapper>
        <ReportCard report={mockReport} onViewDetails={mockOnViewDetails} />
      </TestWrapper>
    );

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it("should successfully navigate to individual report page when View Details is clicked", () => {
    const handleViewDetails = (reportId) => {
      mockNavigate(`/admin/report/${reportId}`);
    };

    render(
      <TestWrapper>
        <ReportCard
          report={mockReport}
          onViewDetails={() => handleViewDetails(mockReport.id)}
        />
      </TestWrapper>
    );

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    fireEvent.click(viewDetailsButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/report/test-report-123");
  });
});
