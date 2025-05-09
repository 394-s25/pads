import { useEffect, useState } from "react";
import Location from "../components/location";

const ReportPage = () => {
    const [activeTab, setActiveTab] = useState("map");
    const [resources, setResources] = useState([]);

    useEffect(() => {
        if (activeTab === "resources" && resources.length === 0) {
            fetch("/resources.txt")
                .then((res) => res.json())
                .then((data) => setResources(data))
                .catch((err) => console.error("Error loading resources:", err));
        }
    }, [activeTab]);

    const renderContent = () => {
      switch (activeTab) {
        case 'map':
            return <Location />;;
        case 'report':
            return <div>TBD ..</div>;
        case 'resources':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
                      <h2 className="text-lg font-bold text-gray-800 mb-2">Resource #{index + 1}</h2>
                      <p className="text-gray-600 mb-4">Description #{index + 1}</p>
                      <a 
                        href={`https://example.com/resource${index + 1}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline"
                      >
                        Link #{index + 1}
                      </a>
                    </div>
                  ))}
                </div>
            );
        default:
          return null;
      }
    };

    return (
        <div>
            <header className="bg-white p-4 flex items-center justify-between shadow-md">
                <div className="flex justify-between items-center w-full">
                    <div className="text-xl font-bold text-gray-800">PADS Lake County Good Neighbor</div>
                    <div className="tabs flex">
                        <button 
                            onClick={() => setActiveTab('map')} 
                            className={`ml-4 px-4 py-2 text-base ${activeTab === 'map' ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-600'}`}
                        >
                            Map
                        </button>
                        <button 
                            onClick={() => setActiveTab('report')} 
                            className={`ml-4 px-4 py-2 text-base ${activeTab === 'report' ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-600'}`}
                        >
                            Report
                        </button>
                        <button 
                            onClick={() => setActiveTab('resources')} 
                            className={`ml-4 px-4 py-2 text-base ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-600'}`}
                        >
                            Resources
                        </button>
                    </div>
                </div>
            </header>
            <main className="p-8 text-lg">
                {renderContent()}
            </main>
        </div>
    );
}

export default ReportPage;