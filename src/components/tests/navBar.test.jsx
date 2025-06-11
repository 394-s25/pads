import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import NavBar from "../NavBar";

// Mock useAuth
vi.mock("../../apis/authProvider", () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}));

const renderWithRouter = (ui, initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
};

describe("NavBar Routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes map tab to /create/map", () => {
    const tabs = [{ id: "map", label: "Map" }];

    renderWithRouter(
      <NavBar tabs={tabs} showLogout={false} logoSrc="/logo.png" />
    );

    const mapLink = screen.getByText("Map");
    expect(mapLink.getAttribute("href")).toBe("/create/map");
  });

  it("routes status tab to /status", () => {
    const tabs = [{ id: "status", label: "Status" }];

    renderWithRouter(
      <NavBar tabs={tabs} showLogout={false} logoSrc="/logo.png" />
    );

    const statusLink = screen.getByText("Status");
    expect(statusLink.getAttribute("href")).toBe("/status");
  });

  it("routes report tab to /create/report", () => {
    const tabs = [{ id: "report", label: "Report" }];

    renderWithRouter(
      <NavBar tabs={tabs} showLogout={false} logoSrc="/logo.png" />
    );

    const reportLink = screen.getByText("Report");
    expect(reportLink.getAttribute("href")).toBe("/create/report");
  });

  it("routes resources tab to /create/resources", () => {
    const tabs = [{ id: "resources", label: "Resources" }];

    renderWithRouter(
      <NavBar tabs={tabs} showLogout={false} logoSrc="/logo.png" />
    );

    const resourcesLink = screen.getByText("Resources");
    expect(resourcesLink.getAttribute("href")).toBe("/create/resources");
  });

  it("routes pendingReports tab to /admin/pendingReports", () => {
    const tabs = [{ id: "pendingReports", label: "Pending Reports" }];

    renderWithRouter(
      <NavBar tabs={tabs} showLogout={false} logoSrc="/logo.png" />
    );

    const pendingReportsLink = screen.getByText("Pending Reports");
    expect(pendingReportsLink.getAttribute("href")).toBe(
      "/admin/pendingReports"
    );
  });

  it("routes resolvedReports tab to /admin/resolvedReports", () => {
    const tabs = [{ id: "resolvedReports", label: "Resolved Reports" }];

    renderWithRouter(
      <NavBar tabs={tabs} showLogout={false} logoSrc="/logo.png" />
    );

    const resolvedReportsLink = screen.getByText("Resolved Reports");
    expect(resolvedReportsLink.getAttribute("href")).toBe(
      "/admin/resolvedReports"
    );
  });
});
