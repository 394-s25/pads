const ReportCard = ({ report, onViewDetails, onGetDirections, onMarkResolved }) => {
    const { location, time, notes, isResolved } = report;

    return (
        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-2xl shadow-md">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">🧍 Reporter</h2>
                    <p className="text-gray-600 flex items-center gap-1 text-base">📍 {location}</p>
                </div>
                <div className="text-right text-gray-600 text-sm space-y-1">
                    <p className="flex items-center gap-1">📅 {new Date(time).toLocaleDateString()}</p>
                    <p className="flex items-center gap-1">⏱ {new Date(time).toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Notes */}
            <div className="p-4 mb-4 bg-gray-100 border border-gray-200 rounded-lg">
                <p className="text-gray-700 text-base flex items-start gap-2">
                    📒 {notes || "No additional notes provided."}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-start sm:justify-end gap-3">
                <button
                    onClick={onViewDetails}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                    👁 View Details
                </button>
                <button
                    onClick={onGetDirections}
                    className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                >
                    📍 Directions
                </button>
                <button
                    onClick={onMarkResolved}
                    disabled={isResolved}
                    className={`px-5 py-2 font-semibold rounded-lg shadow transition ${
                        isResolved
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                >
                    {isResolved ? "✔️ Resolved" : "✔️ Mark Resolved"}
                </button>
            </div>
        </div>
    );
};

export default ReportCard;
