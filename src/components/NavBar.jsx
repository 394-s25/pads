import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ tabs, activeTab, logoSrc, title }) => {
    const location = useLocation();

    const tabRouteMap = {
        map: "/create/map",
        report: "/create/report",
        resources: "/create/resources"
      };      

    return (
        <header className="bg-indigo-900 p-4 flex items-center justify-between shadow-md">
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-center text-white gap-2">
                    {logoSrc && <img src={`/${logoSrc}`} alt="Logo" className="w-30 h-10" />}
                    <h1 className="text-lg font-bold">{title}</h1>
                </div>
                <div className="tabs flex">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            to={tabRouteMap[tab.id]}
                            className={`ml-4 px-4 py-2 text-base ${
                                location.pathname === tabRouteMap[tab.id]
                                    ? "border-b-2 border-white text-white font-bold"
                                    : "text-white hover:text-indigo-200"
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default NavBar;