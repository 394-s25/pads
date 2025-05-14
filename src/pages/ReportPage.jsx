import { useEffect, useState, useRef } from "react";
import Location from "../components/location";
import { getEmergencyNamesByIndices, writeReport } from "../apis/firebaseService";
import ReportForm from "../components/ReportForm";

const ReportPage = () => {
    const [activeTab, setActiveTab] = useState("report");
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        location: '', // get current location from map
        time: '', // enter manually with a time input box or select use current time
        numPeople: 0, // counter with a [- value +], doesn't go below 0, value can also be changed to a number by typing it
        emergencies: '', // selectable buttons, optional
        isResolved: false, // not visible
        notes: '', // larger box
        phoneNumber: '', // optional
        email: '', // optional
        appearance: '', // larger box
        assignedOrg: 'PADS Lake County' // dropdown with only one option as of now
    });
    const [submissionStatus, setSubmissionStatus] = useState("");  // clear page after submission
    const reportFormRef = useRef(null);  // uncheck current location/time boxes on submission


    useEffect(() => {
        if (activeTab === "resources" && resources.length === 0) {
            fetch("/resources.json")
                .then((res) => res.json())
                .then((data) => setResources(data))
                .catch((err) => console.error("Error loading resources:", err));
        }
    }, [activeTab]);
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
        console.log(formData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitted report:', formData);
        await writeReport(...Object.values(formData));

        // reset form to all blank input boxes
        setFormData({
            location: '',
            time: '',
            numPeople: 0,
            emergencies: '',
            isResolved: false,
            notes: '',
            phoneNumber: '',
            email: '',
            appearance: '',
            assignedOrg: 'PADS Lake County'
        });

        if (reportFormRef.current?.resetToggles) {
            reportFormRef.current.resetToggles();
        }  // reset the current location/time check boxes

        // print success message
        setSubmissionStatus("Report successfully submitted.");
        
        // clear message after a few seconds
        setTimeout(() => setSubmissionStatus(""), 5000);
    };

    const renderContent = () => {
      switch (activeTab) {
        case 'map':
            return <Location />;
        case 'report':
            // return <ReportForm 
            //     formData={formData} 
            //     handleChange={handleChange} 
            //     handleSubmit={handleSubmit} 
            //     submissionStatus={submissionStatus} // clear and print after submission object
            // />;
            return (
                <ReportForm  // ReportForm --> forwardRef component
                    ref={reportFormRef}  // uncheck current location/time boxes
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSubmit={handleSubmit} 
                    submissionStatus={submissionStatus}  // clear and print after submission object
                />
            );
        case 'resources':
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {resources.map((resource, index) => (
                        <a
                            key={index}
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white rounded-2xl shadow-md p-6 transition duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-300"
                        >
                            <h2 className="text-lg font-bold text-blue-600 mb-2 group-hover:underline">
                                {resource.title}
                            </h2>
                            <p className="text-gray-700">{resource.description}</p>
                            <p className="mt-4 text-sm text-blue-500 font-medium">Click to visit website →</p>
                        </a>
                    ))}
                </div>
            );
        default:
          return null;
      }
    };

    return (
        <div>
            <header className="bg-indigo-900 p-4 flex items-center justify-between shadow-md">
                <div className="flex justify-between items-center w-full">
                    <div className="text-lg font-bold text-white">
                        <img src="padslogo.png" className="w-25"></img>
                        <h1>Good Neighbor</h1>
                    </div>
                    <div className="tabs flex">
                        <button 
                            onClick={() => setActiveTab('map')} 
                            className={`ml-4 px-4 py-2 text-base ${activeTab === 'map' ? 'border-b-2 border-blue-500 text-white font-bold' : 'text-white'}`}
                        >
                            Map
                        </button>
                        <button 
                            onClick={() => setActiveTab('report')} 
                            className={`ml-4 px-4 py-2 text-base ${activeTab === 'report' ? 'border-b-2 border-blue-500 text-white font-bold' : 'text-white'}`}
                        >
                            Report
                        </button>
                        <button 
                            onClick={() => setActiveTab('resources')} 
                            className={`ml-4 px-4 py-2 text-base ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-white font-bold' : 'text-white'}`}
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