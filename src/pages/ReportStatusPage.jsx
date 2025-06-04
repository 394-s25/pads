import { useState } from "react";
import { getReportById } from "../apis/firebaseService";
import ReportLayout from "../components/ReportLayout";

const ReportStatusPage = () => {
  const [inputId, setInputId] = useState("");
  const [status, setStatus] = useState(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleCheck = async () => {
    try {
      const data = await getReportById(inputId.trim());
      setStatus(
        data?.isResolved == null
          ? "Pending"
          : data.isResolved
          ? "Resolved"
          : "Not resolved"
      );
      setNotes(data?.AdminNotes || "No notes available.");
      setError("");
    } catch {
      setStatus(null);
      setNotes("");
      setError("Report not found.");
    }
  };

  return (
    <ReportLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Check Report Status
      </h2>
      <p className="text-gray-600 mb-6">
        Enter your Report ID to check the status.
      </p>
      <input
        type="text"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        placeholder="Enter Report ID"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleCheck}
        className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
      >
        Check Status
      </button>
      {status && (
        <p className="mt-4 text-green-700 font-semibold">Status: {status}</p>
      )}
      {notes && <p className="mt-4 text-gray-700">Notes: {notes}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </ReportLayout>
  );
};

export default ReportStatusPage;
