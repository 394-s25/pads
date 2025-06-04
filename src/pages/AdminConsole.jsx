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
import AdminLocation from "../components/adminLocation";

const AdminConsole = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const [reports, setReports] = useState({});
  const [sortedReports, setSortedReports] = useState([]);
  const [sortBy, setSortBy] = useState("mostRecent");
  const [activeTab, setActiveTab] = useState(tab || "pendingReports");
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

      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Report Time:", report.time);

      const reportDate = new Date(report.time).getTime();
      const startDateObj = startDate ? new Date(startDate).getTime() : null;
      const endDateObj = endDate
        ? new Date(
            new Date(endDate).toISOString().split("T")[0] + "T23:59:59.999Z"
          ).getTime()
        : null;

      console.log("Parsed Report Date:", reportDate);
      console.log("Parsed Start Date:", startDateObj);
      console.log("Parsed End Date:", endDateObj);

      // Filter by date range
      if (startDateObj && reportDate < startDateObj) {
        console.log(`Excluding report ${key} - Before Start Date`);
        return false;
      }
      if (endDateObj && reportDate > endDateObj) {
        console.log(`Excluding report ${key} - After End Date`);
        return false;
      }

      // Filter by location
      if (
        location &&
        !report.location.toLowerCase().includes(location.toLowerCase())
      ) {
        return false;
      }

      // Filter by notes
      if (notes && !report.notes.toLowerCase().includes(notes.toLowerCase())) {
        return false;
      }

      // Filter by emergency
      if (
        emergency &&
        (!report.emergencyNames || !report.emergencyNames.includes(emergency))
      ) {
        return false;
      }

      return true;
    });

    console.log("Filtered Reports:", filteredReports);

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
            />
          ))}
        </div>
      );
    }

    if (activeTab === "pendingReports") {
      const pendingReports = sortedReports.filter(
        ([, report]) => report.isResolved == null
      );

      return (
        <div>
          {pendingReports.map(([key, report]) => (
            <ReportCard
              key={key}
              report={report}
              onViewDetails={() => handleViewDetails(key)}
              onGetDirections={() => handleGetDirections(report.location)}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "unresolvedReports") {
      const unresolvedReports = sortedReports.filter(
        ([, report]) => report.isResolved === false
      );

      return (
        <div>
          {unresolvedReports.map(([key, report]) => (
            <ReportCard
              key={key}
              report={report}
              onViewDetails={() => handleViewDetails(key)}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "reportMap") {
      return (
        <div>
          <AdminLocation />
        </div>
      )
    }

    return null;
  };

  return (
    <div>
      <NavBar
        logoSrc="padslogo.png"
        title="Admin Console"
        showLogout={true}
        tabs={[
          { id: "pendingReports", label: "Pending Reports" },
          { id: "unresolvedReports", label: "Unresolved Reports" },
          { id: "resolvedReports", label: "Resolved Reports" },
          { id: "reportMap", label: "Map"}
        ]}
        activeTab={activeTab}
        setActiveTab={(tab) => navigate(`/admin/${tab}`)}
      />

      <div className="m-8">
        {activeTab !== "reportMap" && (
          <>
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="emergency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

          <div className="flex justify-end gap-4 my-4">
            <button
              onClick={() => handleSortChange("mostRecent")}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                sortBy === "mostRecent"
                  ? "bg-secondary-blue text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Sort by Date
            </button>
            <button
              onClick={() => handleSortChange("emergencies")}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                sortBy === "emergencies"
                  ? "bg-secondary-blue text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Sort by Emergency
            </button>
          </div>
        </>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminConsole;
