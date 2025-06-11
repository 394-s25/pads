import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ViewReport from "./viewReport";
import { useAuth } from "../apis/authProvider";
import { getReport } from "../apis/adminFunctionality";
import { geocode } from "../utils/geoCoding";

// Mock the dependencies
vi.mock("../apis/authProvider");
vi.mock("../apis/adminFunctionality");
vi.mock("../utils/geoCoding");
vi.mock("../apis/firebaseService");
vi.mock("../components/locationMap", () => ({
  default: ({ latitude, longitude }) => (
    <div data-testid="location-map">
      Map: {latitude}, {longitude}
    </div>
  ),
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ reportId: "test-report-123" }),
    useNavigate: () => mockNavigate,
  };
});

const mockReport = {
  id: "test-report-123",
  location: "123 Main St, Chicago, IL",
  time: "2024-06-01T14:30:00Z",
  numPeople: 3,
  appearance: "Two men in dark clothing, one woman in red jacket",
  emergencyNames: ["Medical Emergency", "Fire Hazard"],
  mediaUrls: [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg",
    "https://example.com/photo3.jpg",
  ],
  notes: "Witnessed suspicious activity near the building entrance",
  phoneNumber: "(555) 123-4567",
  email: "reporter@example.com",
  isResolved: false,
};

const mockCoordinates = {
  lat: 41.8781,
  lng: -87.6298,
};

const mockAuthUser = {
  uid: "admin-123",
  email: "admin@example.com",
};

// Wrapper component for routing context
const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("ViewReport - Admin can see all report details", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ authUser: mockAuthUser });
    getReport.mockResolvedValue(mockReport);
    geocode.mockResolvedValue(mockCoordinates);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should display all report location information", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Location Information")).toBeTruthy();
    });

    // Check location details
    expect(screen.getByText("123 Main St, Chicago, IL")).toBeTruthy();
    expect(screen.getByText("6/1/2024")).toBeTruthy(); // Date formatting may vary
  });

  it("should display all report details", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Report Details")).toBeTruthy();
    });

    // Check report details
    expect(screen.getByText("Number of People: 3")).toBeTruthy();
    expect(
      screen.getByText(
        "Appearance: Two men in dark clothing, one woman in red jacket"
      )
    ).toBeTruthy();
  });

  it("should display emergency information when present", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Emergencies")).toBeTruthy();
    });

    // Check emergency details
    expect(screen.getByText("Medical Emergency")).toBeTruthy();
    expect(screen.getByText("Fire Hazard")).toBeTruthy();
  });

  it("should display all photos/media when present", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Media")).toBeTruthy();
    });

    // Check that all media URLs are rendered as images
    const images = screen.getAllByRole("img");
    const mediaImages = images.filter((img) => img.alt.includes("media"));

    expect(mediaImages).toHaveLength(3);
    expect(mediaImages[0]).toHaveProperty(
      "src",
      "https://example.com/photo1.jpg"
    );
    expect(mediaImages[1]).toHaveProperty(
      "src",
      "https://example.com/photo2.jpg"
    );
    expect(mediaImages[2]).toHaveProperty(
      "src",
      "https://example.com/photo3.jpg"
    );
  });

  it("should display notes section", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Notes")).toBeTruthy();
    });

    expect(
      screen.getByText(
        "Witnessed suspicious activity near the building entrance"
      )
    ).toBeTruthy();
  });

  it("should display contact information", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Contact Information")).toBeTruthy();
    });

    expect(screen.getByText("(555) 123-4567")).toBeTruthy();
    expect(screen.getByText("reporter@example.com")).toBeTruthy();
  });

  it("should display map with correct coordinates", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("location-map")).toBeTruthy();
    });

    // Verify the map component receives the correct coordinates
    expect(screen.getByText("Map: 41.8781, -87.6298")).toBeTruthy();
  });

  it("should call geocoding service with correct location", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(geocode).toHaveBeenCalledWith(
        "123 Main St, Chicago, IL",
        expect.any(String)
      );
    });
  });

  it("should fetch report data with correct ID", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(getReport).toHaveBeenCalledWith("test-report-123");
    });
  });

  it("should handle report without optional fields gracefully", async () => {
    const minimalReport = {
      id: "minimal-report",
      location: "Simple Location",
      time: "2024-06-01T14:30:00Z",
      numPeople: 1,
      appearance: "Basic appearance",
      isResolved: null,
    };

    getReport.mockResolvedValue(minimalReport);

    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Simple Location")).toBeTruthy();
    });

    // Should show "No additional notes" when notes are missing
    expect(screen.getByText("No additional notes")).toBeTruthy();

    // Should not display sections that don't exist
    expect(screen.queryByText("Emergencies")).toBeNull();
    expect(screen.queryByText("Media")).toBeNull();
    expect(screen.queryByText("Contact Information")).toBeNull();
  });

  it("should show loading state initially", () => {
    // Mock a delayed response
    getReport.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    expect(screen.getByText("Loading report details...")).toBeTruthy();
  });

  it("should redirect unauthenticated users", () => {
    useAuth.mockReturnValue({ authUser: null });

    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
