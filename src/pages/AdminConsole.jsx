import { useState, useEffect } from "react";
import { listenToReports } from "../apis/firebaseService";
import ReportCard from "../components/ReportCard";

const AdminConsole = () => {
    const [reports, setReports] = useState({});

    useEffect(() => {
        listenToReports((data) => {
            setReports(data || {});
        });
    }, []);

    const handleViewDetails = (reportId) => {
        console.log("View details for report:", reportId);
    };

    const handleGetDirections = (location) => {
        console.log("Get directions to:", location);
    };

    const handleMarkResolved = (reportId) => {
        console.log("Mark report as resolved:", reportId);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Console</h1>
            <p className="mb-6">Below is the list of reports:</p>
            <div>
                {Object.entries(reports).map(([key, report]) => (
                    <ReportCard
                        key={key}
                        report={report}
                        onViewDetails={() => handleViewDetails(key)}
                        onGetDirections={() => handleGetDirections(report.location)}
                        onMarkResolved={() => handleMarkResolved(key)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminConsole;