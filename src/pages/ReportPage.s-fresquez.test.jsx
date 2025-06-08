import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {MemoryRouter, Routes, Route} from "react-router-dom";
import { getReportById } from "../apis/firebaseService";
import {vi, describe, it, beforeEach, expect} from "vitest";
import "@testing-library/jest-dom";

import ReportPage from "./ReportPage";
import ReportStatusPage from "./ReportStatusPage";

// mock 
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

const mockData = {location: "2313 Sheridan Rd"};

vi.mock("../components/ReportForm", () => ({
  // on render, call handleSubmit
  default: ({ handleSubmit }) => (
    <div data-testid="report-form">
      <h1>Create a New Report</h1>
      <button onClick={() => handleSubmit(mockData, [])} >
        Submit
      </button>
    </div>
  ),
}));

vi.mock("../components/ReportLayout", () => ({
  default: ({ children }) => (
    <div data-testid="report-layout">{children}</div>
  ),
}));

// mock writeReport (to get the report id)
const TEST_REPORT_ID = "-ORsopj-Tb_YbF3ROub";
vi.mock("../apis/firebaseService", () => ({
  writeReport: vi.fn(() => Promise.resolve(TEST_REPORT_ID)),
  getReportById: vi.fn((id) =>
    Promise.resolve({
      isResolved: true,
      AdminNotes: "NOTES",
    })
  ),
}));

const renderReportRoute = (section = "report") =>
  render(
    <MemoryRouter initialEntries={[`/${section}`]}>
      <Routes>
        <Route path="/:section" element={<ReportPage />} />
      </Routes>
    </MemoryRouter>
  );

// tests
  describe("submit + resources", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // mock resources fetch for the resources tab
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          {title: "Resource A", description: "Desc A", link: "https://www.padslakecounty.org/"},
        ]),
    });
  });

  it("renders Create a New Report heading", () => {
    renderReportRoute("report");
    expect(
      screen.getByRole("heading", { name: /create a new report/i })
    ).toBeInTheDocument();
  });

  it("shows the generated report id after submit", async () => {
    renderReportRoute("report");

    // click the submit button
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(screen.getByText(TEST_REPORT_ID)).toBeInTheDocument()
    ); // setReportId & status set
    expect(screen.getByText(/report successfully submitted/i)).toBeInTheDocument();
  });

  it("renders resources and link points to the correct url", async () => {
    renderReportRoute("resources");

    // wait for resources to load via fetch
    const resourceLink = await screen.findByText("Resource A");
    expect(resourceLink).toBeInTheDocument();
    expect(resourceLink.closest("a")).toHaveAttribute("href", "https://www.padslakecounty.org/");});
});

describe("report status loook up", () => {
  it("returns status when a valid ID is entered", async () => {
    render(
      <MemoryRouter>
        <ReportStatusPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/enter report id/i);
    fireEvent.change(input, { target: { value: TEST_REPORT_ID } });
    fireEvent.click(screen.getByText(/check status/i));

    await waitFor(() =>
      expect(screen.getByText(/status: resolved/i)).toBeInTheDocument()
    ); 
    expect(screen.getByText(/notes:/i)).toHaveTextContent("NOTES");
  });

  it("shows 'Report not found.' when an invalid ID is entered", async () => {
    // make this one call reject
    getReportById.mockRejectedValueOnce(new Error("not found"));
    
    render(
    <MemoryRouter>
      <ReportStatusPage />
    </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter report id/i), {target: {value: "BAD-ID-999"}});
    fireEvent.click(screen.getByText(/check status/i));

    await waitFor(() => expect(screen.getByText(/report not found\./i)).toBeInTheDocument());

    // confirm nothing is displayed on error
    expect(screen.queryByText(/status:/i)).toBeNull();
    expect(screen.queryByText(/notes:/i)).toBeNull();
    
    });
});
