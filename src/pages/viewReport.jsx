const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../apis/authProvider";
import { getReport } from "../apis/adminFunctionality";
import { geocode } from "../utils/geoCoding";
import { updateIsResolved } from "../apis/firebaseService";
import LocationMap from "../components/locationMap";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Shirt,
  FileText,
  AlertTriangle,
  Phone,
  Mail,
  ArrowLeft,
  User,
} from "lucide-react";
import { set } from "firebase/database";

const ViewReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [report, setReport] = useState(null);
  const [resolved, setResolved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (!authUser) {
      navigate("/");
      return;
    }

    const fetchReport = async () => {
      try {
        const reportData = await getReport(reportId);
        console.log("Fetched report data:", reportData);
        setReport(reportData);
        setResolved(reportData.isResolved);
        console.log("Report resolved status:", reportData.isResolved);

        // get coords from geocode api
        if (reportData && reportData.location) {
          const coords = await geocode(reportData.location, API_KEY);
          setCoordinates(coords);
        }
      } catch (error) {
        console.error("error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, authUser, navigate]);

  const handleStatusChange = async () => {
    try {
      await updateIsResolved(reportId, !resolved);
      setResolved(!resolved);
    } catch (error) {
      console.error("Error marking report as resolved:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-lg">Loading report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-lg">Report not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() =>
            navigate(
              resolved ? "/admin/resolvedReports" : "/admin/unresolvedReports"
            )
          }
          className="hover:text-secondary-blue hover:cursor-pointer text-primary-blue font-bold py-2 px-4 rounded-full flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Console
        </button>
        <button
          className="bg-primary-blue hover:bg-secondary-blue text-white font-bold py-2 px-4 rounded-full flex items-center"
          onClick={handleStatusChange}
        >
          {resolved ? "Mark as Unresolved" : "Mark as Resolved"}
        </button>
      </div>

      <div className="bg-white p-6">
        {/* Map display */}
        <div className="mb-10 h-64 rounded-lg overflow-hidden border border-gray-200">
          <LocationMap latitude={coordinates.lat} longitude={coordinates.lng} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl text-primary-blue font-bold mb-4">
              Location Information
            </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={18} className="text-secondary-blue" />
              <span>{report.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar size={18} className="text-secondary-blue" />
              <span>{new Date(report.time).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock size={18} className="text-secondary-blue" />
              <span>{new Date(report.time).toLocaleTimeString()}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-primary-blue ">
              Report Details
            </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Users size={18} className="text-secondary-blue" />
              <span>Number of People: {report.numPeople}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <Shirt size={18} className="text-secondary-blue mt-1" />
              <span>Appearance: {report.appearance}</span>
            </div>
          </div>

          {report.emergencyNames && report.emergencyNames.length > 0 && (
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                Emergencies
              </h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <ul className="list-disc list-inside">
                  {report.emergencyNames.map((emergency, index) => (
                    <li key={index} className="text-red-700">
                      {emergency}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {report.appearance && (
            <div className="md:col-span-2">
              <h2 className="text-primary-blue  text-xl font-bold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-secondary-blue" />
                Notes
              </h2>
              <p className="text-gray-600">
                {report.notes || "No additional notes"}
              </p>
            </div>
          )}

          {report.phoneNumber && (
            <div className="md:col-span-2">
              <h2 className="text-primary-blue text-xl font-bold mb-4">
                Contact Information
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Phone size={18} className="text-secondary-blue" />
                <span>{report.phoneNumber}</span>
              </div>
              {report.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} className="text-secondary-blue" />
                  <span>{report.email}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
