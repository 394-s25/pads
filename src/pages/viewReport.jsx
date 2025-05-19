import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../apis/authProvider";
import { getReport } from "../apis/adminFunctionality";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  Phone,
  Mail,
  ArrowLeft,
  User,
} from "lucide-react";

const ViewReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchReport();
  }, [reportId, authUser, navigate]);

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-['Manrope']">View Report</h1>
          <button
              onClick={() =>
                  navigate(report.isResolved ? "/admin/resolvedReports" : "/admin/unresolvedReports")
              }
              className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-['Manrope'] font-bold py-2 px-4 rounded-full flex items-center gap-2"
          >
              <ArrowLeft size={18} />
              Back to Admin
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold font-['Manrope'] mb-4">
              Location Information
            </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={18} className="text-indigo-600" />
              <span>{report.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar size={18} className="text-indigo-600" />
              <span>{new Date(report.time).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock size={18} className="text-indigo-600" />
              <span>{new Date(report.time).toLocaleTimeString()}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-['Manrope'] mb-4">
              Report Details
            </h2>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Users size={18} className="text-indigo-600" />
              <span>Number of People: {report.numPeople}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <FileText size={18} className="text-indigo-600 mt-1" />
              <span>Notes: {report.notes || "No additional notes"}</span>
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
              <h2 className="text-xl font-bold font-['Manrope'] mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                Appearance
              </h2>
              <p className="text-gray-600">{report.appearance}</p>
            </div>
          )}

          {report.phoneNumber && (
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold font-['Manrope'] mb-4">
                Contact Information
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Phone size={18} className="text-indigo-600" />
                <span>{report.phoneNumber}</span>
              </div>
              {report.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} className="text-indigo-600" />
                  <span>{report.email}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button className="mt-8 w-full bg-white hover:bg-indigo-50 text-indigo-900 font-['Manrope'] font-bold py-4 px-4 rounded-full border-2 border-indigo-900">
        Mark as Resolved
      </button>
    </div>
  );
};

export default ViewReport;
