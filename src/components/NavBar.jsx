import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../apis/authProvider";

const NavBar = ({ tabs, activeTab, showLogout, logoSrc, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleStaffLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Login error");
    }
  };

  const tabRouteMap = {
    map: "/create/map",
    report: "/create/report",
    resources: "/create/resources",
    resolvedReports: "/admin/resolvedReports",
    unresolvedReports: "/admin/unresolvedReports",
  };

  return (
    <header className="bg-primary-blue p-4 flex items-center justify-between shadow-md">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col items-center text-white gap-2">
          {logoSrc && (
            <img
              src={`/${logoSrc}`}
              alt="Logo"
              className="w-28 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}
          {/* <h1 className="font-extrabold">{title}</h1> */}
        </div>
        <div className="tabs flex">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tabRouteMap[tab.id]}
              className={`ml-4 px-4 py-2 text-base ${
                location.pathname === tabRouteMap[tab.id]
                  ? "border-b-2 border-white text-white font-bold"
                  : "text-white hover:text-tertiary-blue"
              }`}
            >
              {tab.label}
            </Link>
          ))}
          {/* Logout Button */}
          {showLogout && (
            <button
              onClick={handleStaffLogout}
              className="mx-4 px-4 py-2 text-base text-white hover:text-indigo-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
