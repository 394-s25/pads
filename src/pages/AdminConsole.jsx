import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  listenToReports,
  getEmergencyNamesByIndices,
  updateIsResolved,
} from "../apis/firebaseService";
import ReportCard from "../components/ReportCard";
import NavBar from "../components/NavBar";
import { useAuth } from "../apis/authProvider";

const AdminConsole = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [reports, setReports] = useState({});
  const [sortedReports, setSortedReports] = useState([]);
  const [sortBy, setSortBy] = useState("mostRecent");
  const [activeTab, setActiveTab] = useState(tab || "unresolvedReports");

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    listenToReports(async (data) => {
      const updatedReports = {};

      for (const [key, report] of Object.entries(data || {})) {
        const emergencyIndices = report.emergencies || [];
        const emergencyNames = await getEmergencyNamesByIndices(
          emergencyIndices
        );

        updatedReports[key] = {
          ...report,
          emergencyNames,
        };
      }
      console.log("Updated reports:", updatedReports);
      setReports(updatedReports);
    });
  }, []);

  useEffect(() => {
    const sorted = Object.entries(reports).sort(
      ([keyA, reportA], [keyB, reportB]) => {
        const emergenciesA = reportA.emergencies || [];
        const emergenciesB = reportB.emergencies || [];

        if (sortBy === "mostRecent") {
          return new Date(reportB.time) - new Date(reportA.time);
        } else if (sortBy === "emergencies") {
          if (emergenciesB.length !== emergenciesA.length) {
            return emergenciesB.length - emergenciesA.length;
          }
          return new Date(reportB.time) - new Date(reportA.time);
        }
        return 0;
      }
    );

    setSortedReports(sorted);
  }, [reports, sortBy]);

  useEffect(() => {
    setActiveTab(tab || "unresolvedReports");
  }, [tab]);

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption); 
  };

  const handleViewDetails = (reportId) => {
    navigate(`/admin/report/${reportId}`);
  };

  const handleGetDirections = (location) => {
    console.log("Get directions to:", location);
  };

  const handleMarkResolved = async (reportId) => {
    try {
      await updateIsResolved(reportId, true);

      setReports((prevReports) => ({
        ...prevReports,
        [reportId]: {
          ...prevReports[reportId],
          isResolved: true,
        },
      }));

      console.log(`Report ${reportId} marked as resolved.`);
    } catch (error) {
      console.error("Error marking report as resolved:", error);
    }
  };

  const handleMarkUnresolved = async (reportId) => {
    try {
      await updateIsResolved(reportId, false);

      setReports((prevReports) => ({
        ...prevReports,
        [reportId]: {
          ...prevReports[reportId],
          isResolved: false,
        },
      }));

      console.log(`Report ${reportId} marked as unresolved.`);
    } catch (error) {
      console.error("Error marking report as unresolved:", error);
    }
  };

  const handleStaffLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Login error");
    }
  };

  const renderContent = () => {
    if (activeTab === "resolvedReports") {
      const resolvedReports = sortedReports.filter(
        ([, report]) => report.isResolved
      );

      return (
        <div>
          {resolvedReports.map(([key, report]) => (
            <ReportCard
              key={key}
              report={report}
              onViewDetails={() => handleViewDetails(key)}
              onGetDirections={() => handleGetDirections(report.location)}
              onMarkResolved={() => handleMarkUnresolved(key)}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "unresolvedReports") {
      const unresolvedReports = sortedReports.filter(
        ([, report]) => !report.isResolved
      );

      return (
        <div>
          {unresolvedReports.map(([key, report]) => (
            <ReportCard
              key={key}
              report={report}
              onViewDetails={() => handleViewDetails(key)}
              onGetDirections={() => handleGetDirections(report.location)}
              onMarkResolved={() => handleMarkResolved(key)}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-8">
      {/* NavBar */}
      <NavBar
        logoSrc="padslogo.png"
        title="Admin Console"
        tabs={[
          { id: "unresolvedReports", label: "Unresolved Reports" },
          { id: "resolvedReports", label: "Resolved Reports" },
        ]}
        activeTab={activeTab}
        setActiveTab={(tab) => navigate(`/admin/${tab}`)}
      />

      {/* Sort Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => handleSortChange("mostRecent")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            sortBy === "mostRecent"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Sort by Date
        </button>
        <button
          onClick={() => handleSortChange("emergencies")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            sortBy === "emergencies"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Sort by Emergency
        </button>
      </div>

      {/* Logout Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleStaffLogout}
          className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-bold py-2 px-6 rounded-full text-sm"
        >
          Logout
        </button>
      </div>

      {/* Render Content Based on Active Tab */}
      {renderContent()}
    </div>
  );
};

export default AdminConsole;