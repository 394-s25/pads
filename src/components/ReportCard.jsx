import { ArrowRight } from "lucide-react";

const ReportCard = ({ report, onViewDetails, onMarkResolved }) => {
  const { location, time, notes, isResolved, emergencyNames } = report;

  return (
    <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-xs">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-secondary-blue">
            {location}
          </h2>
        </div>
        <div className="text-right text-sm text-primary-blue font-medium">
          <p> {new Date(time).toLocaleDateString()}</p>
          <p> {new Date(time).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Emergencies */}
      {emergencyNames && emergencyNames.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-red-600">Emergencies</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {emergencyNames.map((emergency, index) => (
              <li key={index}>{emergency}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-800">Notes</h3>
        <p className="text-sm text-gray-600">
          {notes || "No additional notes provided."}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onViewDetails}
          className="border border-primary-blue hover:border-primary-blue/75 hover:text-primary-blue/75 hover:cursor-pointer text-primary-blue font-bold py-2 px-4 rounded-full flex items-center"
        >
          View Details
          <ArrowRight size={20} className="ml-2" />
        </button>
        {/* moving the resolve functionality to the page itself (user should review page to confirm status to prevent errors)*/}
        {/* <button
                    onClick={onGetDirections}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                >
                    Directions
                </button> */}
        {/* <button
          onClick={onMarkResolved}
          className={`px-4 py-2 font-medium rounded-full transition ${
            isResolved
              ? "bg-secondary-orange text-white hover:bg-red-700"
              : "bg-tertiary-blue text-primary-blue hover:bg-tertiary-blue/75"
          }`}
        >
          {isResolved ? "Mark Unresolved" : "Mark Resolved"}
        </button> */}
      </div>
    </div>
  );
};

export default ReportCard;
