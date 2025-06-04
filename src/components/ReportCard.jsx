import { ArrowRight } from "lucide-react";

const ReportCard = ({ report, onViewDetails }) => {
  const { location, time, notes, emergencyNames } = report;

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
      </div>
    </div>
  );
};

export default ReportCard;
