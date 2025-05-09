import { useState } from "react";

const ReportPage = () => {
    const [activeTab, setActiveTab] = useState('map');

    const renderContent = () => {
      switch (activeTab) {
        case 'map':
          return <div>TBD ..</div>;
        case 'report':
          return <div>TBD ..</div>;
        case 'resources':
          return <div>TBD ..</div>;
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