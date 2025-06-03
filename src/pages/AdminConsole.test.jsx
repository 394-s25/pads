import { describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";import AdminConsole from "./AdminConsole";
import { listenToReports } from "../apis/firebaseService";
import { AuthContext } from "../apis/authProvider";

// Mock data
const mockReports = {
  report1: { id: "report1", isResolved: false, location: "Location A" },
  report2: { id: "report2", isResolved: true, location: "Location B" },
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
});