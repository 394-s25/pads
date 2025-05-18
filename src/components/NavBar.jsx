import React from "react";

const NavBar = ({ tabs, activeTab, setActiveTab, logoSrc, title }) => {
    return (
        <header className="bg-indigo-900 p-4 flex items-center justify-between shadow-md">
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-center text-white gap-2">
                    {logoSrc && <img src={logoSrc} alt="Logo" className="w-30 h-10" />}
                    <h1 className="text-lg font-bold">{title}</h1>
                </div>
                <div className="tabs flex">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`ml-4 px-4 py-2 text-base ${
                                activeTab === tab.id
                                    ? "border-b-2 border-blue-500 text-white font-bold"
                                    : "text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default NavBar;