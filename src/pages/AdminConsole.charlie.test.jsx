import { describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";import AdminConsole from "./AdminConsole";
import { listenToReports } from "../apis/firebaseService";
import { AuthContext } from "../apis/authProvider";

// Mock data
const mockReports = {
  report1: { id: "report1", isResolved: false, location: "Location A", notes: "Test note 1", time: "2025-06-01T12:00:00Z" },
  report2: { id: "report2", isResolved: true, location: "Location B", notes: "Test note 2", time: "2025-06-01T12:00:00Z" },
  report3: { id: "report3", isResolved: false, location: "Location C", notes: "Test note 3", time: "2025-06-02T12:00:00Z" },
  report4: { id: "report4", isResolved: true, location: "Location D", notes: "Test note 4", time: "2025-06-03T12:00:00Z" },
  report5: { id: "report5", isResolved: false, location: "Location E", notes: "Test note 5", time: "2025-06-03T12:00:00Z" },
};

vi.mock("../apis/firebaseService", () => ({
  listenToReports: vi.fn(),
  getEmergencyNamesByIndices: vi.fn(() => Promise.resolve([])), // mock if used
}));

beforeEach(() => {
  listenToReports.mockImplementation((callback) => {
    callback(mockReports);
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("AdminConsole tests", () => {
  it("should render unresolved reports", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/unresolvedReports"]}>
        <Routes>
          <Route
            path="/admin/:tab"
            element={
              <AuthContext.Provider
                value={{
                  authUser: { uid: "testUser" },
                  isLoading: false,
                  login: vi.fn(),
                  logout: vi.fn(),
                }}
              >
                <AdminConsole />
              </AuthContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Location A")).toBeDefined();
    });
  });

  it("should render resolved reports", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/resolvedReports"]}>
        <Routes>
          <Route
            path="/admin/:tab"
            element={
              <AuthContext.Provider
                value={{
                  authUser: { uid: "testUser" },
                  isLoading: false,
                  login: vi.fn(),
                  logout: vi.fn(),
                }}
              >
                <AdminConsole />
              </AuthContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Location B")).toBeDefined();

    });  
    });
    
    // Add filter tests for time, notes, and location
    it("should filter reports by time", async () => {
      render(
        <MemoryRouter initialEntries={["/admin/unresolvedReports"]}>
          <Routes>
            <Route
              path="/admin/:tab"
              element={
                <AuthContext.Provider
                  value={{
                    authUser: { uid: "testUser" },
                    isLoading: false,
                    login: vi.fn(),
                    logout: vi.fn(),
                  }}
                >
                  <AdminConsole />
                </AuthContext.Provider>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      // Simulate user input for filtering by time range
      const startDateInput = screen.getByLabelText(/Start Date/i);
      const endDateInput = screen.getByLabelText(/End Date/i);

      fireEvent.change(startDateInput, { target: { value: "2025-06-01" } });
      fireEvent.change(endDateInput, { target: { value: "2025-06-02" } });

      await waitFor(() => {
        expect(screen.getByText("Location A")).toBeDefined();
        expect(screen.getByText("Location C")).toBeDefined();

        expect(screen.queryByText("Location B")).toBeNull(); // B should fall into the same time range, but is resolved, so it should not appear.
        expect(screen.queryByText("Location D")).toBeNull();
        expect(screen.queryByText("Location E")).toBeNull();
      });
    });

    it("should filter reports by location", async () => {
  render(
    <MemoryRouter initialEntries={["/admin/unresolvedReports"]}>
      <Routes>
        <Route
          path="/admin/:tab"
          element={
            <AuthContext.Provider
              value={{
                authUser: { uid: "testUser" },
                isLoading: false,
                login: vi.fn(),
                logout: vi.fn(),
              }}
            >
              <AdminConsole />
            </AuthContext.Provider>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  const locationInput = screen.getByLabelText(/Location/i);

  // Case 1: Typing "Location" should display all unresolved reports
  fireEvent.change(locationInput, { target: { value: "Location" } });
  await waitFor(() => {
    expect(screen.getByText("Location A")).toBeDefined();
    expect(screen.getByText("Location C")).toBeDefined();
    expect(screen.getByText("Location E")).toBeDefined();
  });

  // Case 2: Typing "A" should display only report1
  fireEvent.change(locationInput, { target: { value: "Location A" } });
  await waitFor(() => {
    expect(screen.getByText("Location A")).toBeDefined();
    expect(screen.queryByText("Location B")).toBeNull();
    expect(screen.queryByText("Location C")).toBeNull();
    expect(screen.queryByText("Location D")).toBeNull();
    expect(screen.queryByText("Location E")).toBeNull();
  });

  // Case 3: Typing "Locations" should display no reports
  fireEvent.change(locationInput, { target: { value: "Locations" } });
  await waitFor(() => {
    expect(screen.queryByText("Location A")).toBeNull();
    expect(screen.queryByText("Location B")).toBeNull();
    expect(screen.queryByText("Location C")).toBeNull();
    expect(screen.queryByText("Location D")).toBeNull();
    expect(screen.queryByText("Location E")).toBeNull();
  });
});
it("should filter reports by notes", async () => {
  render(
    <MemoryRouter initialEntries={["/admin/unresolvedReports"]}>
      <Routes>
        <Route
          path="/admin/:tab"
          element={
            <AuthContext.Provider
              value={{
                authUser: { uid: "testUser" },
                isLoading: false,
                login: vi.fn(),
                logout: vi.fn(),
              }}
            >
              <AdminConsole />
            </AuthContext.Provider>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  const notesInput = screen.getByLabelText(/Notes/i);

  // Case 1: Typing "Test note" should display all unresolved reports with matching notes
  fireEvent.change(notesInput, { target: { value: "Test note" } });
  await waitFor(() => {
    expect(screen.getByText("Location A")).toBeDefined();
    expect(screen.getByText("Location C")).toBeDefined();
    expect(screen.getByText("Location E")).toBeDefined();
  });

  // Case 2: Typing "Test note 1" should display only report1
  fireEvent.change(notesInput, { target: { value: "Test note 1" } });
  await waitFor(() => {
    expect(screen.getByText("Location A")).toBeDefined();
    expect(screen.queryByText("Location B")).toBeNull();
    expect(screen.queryByText("Location C")).toBeNull();
    expect(screen.queryByText("Location D")).toBeNull();
    expect(screen.queryByText("Location E")).toBeNull();
  });

  // Case 3: Typing "Invalid note" should display no reports
  fireEvent.change(notesInput, { target: { value: "Invalid note" } });
  await waitFor(() => {
    expect(screen.queryByText("Location A")).toBeNull();
    expect(screen.queryByText("Location B")).toBeNull();
    expect(screen.queryByText("Location C")).toBeNull();
    expect(screen.queryByText("Location D")).toBeNull();
    expect(screen.queryByText("Location E")).toBeNull();
  });
});
});