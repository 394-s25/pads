import React from "react";
import { Link, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const ReportLayout = ({ children }) => {
  const location = useLocation();

  const tabClass = (path) =>
    `px-4 py-2 rounded-full font-medium shadow-md border border-slate-100 transition-colors ${
      location.pathname === path
        ? "bg-indigo-600 text-white hover:bg-indigo-700"
        : "bg-indigo-200 text-gray-700 hover:bg-gray-300"
    }`;

  const routeToTab = {
    "/create": "report",
    "/drafts": "drafts",
    "/status": "status",
  };

  const activeTab = routeToTab[location.pathname] || "report";

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar
        logoSrc="padslogo.png"
        showLogout={false}
        title="Good Neighbor"
        tabs={[
          { id: "map", label: "Map" },
          { id: "report", label: "Report" },
          { id: "resources", label: "Resources" },
        ]}
        activeTab={activeTab}
      />

      <div className="container mx-auto p-6 max-w-4xl">
        <header className="mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-indigo-900">Reports</h1>
          <div className="flex gap-4 mt-4">
            <Link to="/create" className={tabClass("/create")}>
              Create Report
            </Link>
            <Link to="/drafts" className={tabClass("/drafts")}>
              Saved Drafts
            </Link>
            <Link to="/status" className={tabClass("/status")}>
              Report Status
            </Link>
          </div>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-lg">
          {children}
        </section>
      </div>
    </div>
  );
};

export default ReportLayout;
