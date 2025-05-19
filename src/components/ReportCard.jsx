const ReportCard = ({ report, onViewDetails, onGetDirections, onMarkResolved }) => {
    const { location, time, notes, isResolved, emergencyNames } = report;

    return (
        <div className="p-6 mb-6 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Report Details</h2>
                    <p className="text-sm text-gray-500"> {location}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                    View Details
                </button>
                <button
                    onClick={onGetDirections}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                >
                    Directions
                </button>
                <button
                    onClick={onMarkResolved}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                        isResolved
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                >
                    {isResolved ? "Mark Unresolved" : "Mark Resolved"}
                </button>
            </div>
        </div>
    );
};

export default ReportCard;