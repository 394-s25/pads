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
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [reports, setReports] = useState({});
  const [sortedReports, setSortedReports] = useState([]);
  const [sortBy, setSortBy] = useState("mostRecent");
  const [activeTab, setActiveTab] = useState(tab || "unresolvedReports");
  const [filters, setFilters] = useState({
      startDate: "",
      endDate: "",
      location: "",
      notes: "",
      emergency: "",
    });
  const [emergencyOptions, setEmergencyOptions] = useState([]);

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    listenToReports(async (data) => {
      const updatedReports = {};
      const emergencySet = new Set();

      for (const [key, report] of Object.entries(data || {})) {
        const emergencyIndices = report.emergencies || [];
        const emergencyNames = await getEmergencyNamesByIndices(
          emergencyIndices
        );

        emergencyNames.forEach((name) => emergencySet.add(name));

        updatedReports[key] = {
          ...report,
          emergencyNames,
        };
      }

      setEmergencyOptions([...emergencySet]);
      setReports(updatedReports);
    });
  }, []);

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

    useEffect(() => {
    const filteredReports = Object.entries(reports).filter(([key, report]) => {
      const { startDate, endDate, location, notes, emergency } = filters;

      // Filter by date range
      if (startDate && new Date(report.time) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(report.time) > new Date(endDate)) {
        return false;
      }

      // Filter by location
      if (location && !report.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Filter by notes
      if (notes && !report.notes.toLowerCase().includes(notes.toLowerCase())) {
        return false;
      }

      // Filter by emergency
      if (
        emergency &&
        (!report.emergencyNames ||
          !report.emergencyNames.includes(emergency))
      ) {
        return false;
      }

      return true;
    });

    const sorted = filteredReports.sort(([keyA, reportA], [keyB, reportB]) => {
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
    });

    setSortedReports(sorted);
  }, [reports, sortBy, filters]);
  
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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
    <div>
      {/* NavBar */}
      <NavBar
        logoSrc="padslogo.png"
        title="Admin Console"
        showLogout={true}
        tabs={[
          { id: "unresolvedReports", label: "Unresolved Reports" },
          { id: "resolvedReports", label: "Resolved Reports" },
        ]}
        activeTab={activeTab}
        setActiveTab={(tab) => navigate(`/admin/${tab}`)}
      />
      
      <div className="m-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={filters.notes}
                onChange={handleFilterChange}
                placeholder="Enter notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="emergency" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency
              </label>
              <select
                id="emergency"
                name="emergency"
                value={filters.emergency}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Emergencies</option>
                {emergencyOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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

        {/* Render Content Based on Active Tab */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminConsole;
