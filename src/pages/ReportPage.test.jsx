import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import ReportPage from "./ReportPage";

// Mock components
vi.mock("../components/Location", () => ({
  default: () => <div data-testid="location-component">Location Component</div>,
}));

vi.mock("../components/ReportForm", () => ({
  default: vi.fn(() => <div data-testid="report-form">Report Form</div>),
}));

vi.mock("../components/ReportLayout", () => ({
  default: ({ children }) => <div data-testid="report-layout">{children}</div>,
}));

// Mock other dependencies to prevent errors
vi.mock("../apis/firebaseService", () => ({
  writeReport: vi.fn(),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock("../utils/geoCoding", () => ({
  geocode: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  Clipboard: () => <div>Clipboard Icon</div>,
}));

// Mock global fetch
global.fetch = vi.fn();

const renderWithRouter = (section) => {
  return render(
    <MemoryRouter initialEntries={[`/${section || "report"}`]}>
      <Routes>
        <Route path="/:section" element={<ReportPage />} />
        <Route path="/" element={<ReportPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ReportPage - renderContent switch cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock resources fetch
    global.fetch.mockResolvedValue({
      json: () =>
        Promise.resolve([
          {
            title: "Resource 1",
            description: "Description 1",
            link: "https://example.com/1",
          },
          {
            title: "Resource 2",
            description: "Description 2",
            link: "https://example.com/2",
          },
        ]),
    });
  });

  it('renders Location component when section is "map"', () => {
    renderWithRouter("map");

    expect(screen.getByTestId("location-component")).toBeInTheDocument();
    expect(screen.queryByTestId("report-form")).not.toBeInTheDocument();
    expect(screen.queryByText("Resource 1")).not.toBeInTheDocument();
  });

  it('renders resources grid when section is "resources"', async () => {
    renderWithRouter("resources");

    // Wait for resources to load
    await screen.findByText("Resource 1");

    expect(screen.getByText("Resource 1")).toBeInTheDocument();
    expect(screen.getByText("Resource 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.queryByTestId("location-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("report-form")).not.toBeInTheDocument();
  });

  it('renders ReportForm when section is "report"', () => {
    renderWithRouter("report");

    expect(screen.getByTestId("report-form")).toBeInTheDocument();
    expect(screen.queryByTestId("location-component")).not.toBeInTheDocument();
    expect(screen.queryByText("Resource 1")).not.toBeInTheDocument();
  });

  it("renders ReportForm by default when section is undefined", () => {
    renderWithRouter();

    expect(screen.getByTestId("report-form")).toBeInTheDocument();
    expect(screen.queryByTestId("location-component")).not.toBeInTheDocument();
    expect(screen.queryByText("Resource 1")).not.toBeInTheDocument();
  });

  it("renders ReportForm for any other section", () => {
    renderWithRouter("unknown-section");

    expect(screen.getByTestId("report-form")).toBeInTheDocument();
    expect(screen.queryByTestId("location-component")).not.toBeInTheDocument();
    expect(screen.queryByText("Resource 1")).not.toBeInTheDocument();
  });

  it("always wraps content in ReportLayout", () => {
    const { unmount: unmount1 } = renderWithRouter("map");
    expect(screen.getByTestId("report-layout")).toBeInTheDocument();
    unmount1();

    const { unmount: unmount2 } = renderWithRouter("resources");
    expect(screen.getByTestId("report-layout")).toBeInTheDocument();
    unmount2();

    const { unmount: unmount3 } = renderWithRouter("report");
    expect(screen.getByTestId("report-layout")).toBeInTheDocument();
    unmount3();
  });
});
