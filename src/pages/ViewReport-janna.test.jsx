import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ViewReport from "./viewReport";
import { useAuth } from "../apis/authProvider";
import { getReport } from "../apis/adminFunctionality";
import { geocode } from "../utils/geoCoding";

vi.mock("../apis/authProvider");
vi.mock("../apis/adminFunctionality");
vi.mock("../utils/geoCoding");
vi.mock("../apis/firebaseService");
vi.mock("../components/locationMap", () => ({
  default: ({ latitude, longitude }) => (
    <div data-testid="location-map">
      map: {latitude}, {longitude}
    </div>
  ),
}));

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
  location: "123 Main st, Chicago, IL",
  time: "2024-06-01T14:30:00Z",
  numPeople: 3,
  appearance: "two men in dark clothing",
  emergencyNames: ["Children Involved"],
  mediaUrls: ["https://example.com/photo1.jpg"],
  notes: "witnessed suspicious activity",
  phoneNumber: "123-123-4567",
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

const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("viewreport tests", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ authUser: mockAuthUser });
    getReport.mockResolvedValue(mockReport);
    geocode.mockResolvedValue(mockCoordinates);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("displays location information", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("123 Main st, Chicago, IL")).toBeTruthy();
    });
  });

  it("displays report details", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Number of People: 3")).toBeTruthy();
      expect(
        screen.getByText("Appearance: two men in dark clothing")
      ).toBeTruthy();
    });
  });

  it("displays emergencies", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Children Involved")).toBeTruthy();
    });
  });

  it("displays media", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      const mediaImages = images.filter((img) => img.alt.includes("media"));
      expect(mediaImages).toHaveLength(1);
    });
  });

  it("displays notes", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("witnessed suspicious activity")).toBeTruthy();
    });
  });

  it("displays contact info", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("123-123-4567")).toBeTruthy();
      expect(screen.getByText("reporter@example.com")).toBeTruthy();
    });
  });

  it("displays map", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("map: 41.8781, -87.6298")).toBeTruthy();
    });
  });

  it("calls getReport with correct id", async () => {
    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(getReport).toHaveBeenCalledWith("test-report-123");
    });
  });

  it("redirects unauthenticated users", () => {
    useAuth.mockReturnValue({ authUser: null });

    render(
      <TestWrapper>
        <ViewReport />
      </TestWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
