import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenToReports,
  getEmergencyNamesByIndices,
} from "../apis/firebaseService";
import ReportCard from "../components/ReportCard";
import { useAuth } from "../apis/authProvider";

const AdminConsole = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState({});
  const [sortedReports, setSortedReports] = useState([]);
  const [sortBy, setSortBy] = useState("mostRecent");

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

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleViewDetails = (reportId) => {
    navigate(`/admin/${reportId}`);
  };

  const handleGetDirections = (location) => {
    console.log("Get directions to:", location);
  };

  const handleMarkResolved = (reportId) => {
    const updatedReports = { ...reports };
    delete updatedReports[reportId];
    setReports(updatedReports);
    // For now, since we're demoing. Will change to remove from DB later
    console.log("Removed report:", reportId);
    //   const reportRef = ref(database, "report/${reportId}");
    //   remove(reportRef)
    //     .then(() => {
    //       console.log("Report removed from DB:", reportId);
    //     })
    //     .catch((error) => {
    //       console.error("Error removing report:", error);
    //     });

    //   console.log("Mark report as resolved:", reportId);
    // };
  };

  const handleStaffLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Login error");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-['Manrope'] font-extrabold">
          Admin Console
        </h1>
      </div>

      <p className="mb-6 text-gray-600">Below is the list of reports:</p>
      {/* Sort Dropdown */}
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 font-semibold text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mostRecent">Most Recent</option>
          <option value="emergencies">Emergencies</option>
        </select>
      </div>

      {/* Reports List */}
      <div>
        {sortedReports.map(([key, report]) => (
          <ReportCard
            key={key}
            report={report}
            onViewDetails={() => handleViewDetails(key)}
            onGetDirections={() => handleGetDirections(report.location)}
            onMarkResolved={() => handleMarkResolved(key)}
          />
        ))}
      </div>
      <button
        onClick={handleStaffLogout}
        className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-bold py-3 px-8 rounded-full flex items-center text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminConsole;
