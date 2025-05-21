import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Location from "../components/location";
import { writeReport } from "../apis/firebaseService";
import ReportForm from "../components/ReportForm";
import ReportLayout from "../components/ReportLayout";

const ReportPage = () => {
  const { section } = useParams(); // 'report', 'map', or 'resources'
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    location: "",
    time: "",
    numPeople: 0,
    emergencies: "",
    isResolved: false,
    notes: "",
    phoneNumber: "",
    email: "",
    appearance: "",
    assignedOrg: "PADS Lake County",
  });
  const [submissionStatus, setSubmissionStatus] = useState("");
  const reportFormRef = useRef(null);

  useEffect(() => {
    if (section === "resources" && resources.length === 0) {
      fetch("/resources.json")
        .then((res) => res.json())
        .then((data) => setResources(data))
        .catch((err) => console.error("Error loading resources:", err));
    }
  }, [section]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted report:", formData);

    try {
      const reportId = await writeReport(...Object.values(formData));

      setFormData({
        location: "",
        time: "",
        numPeople: 0,
        emergencies: "",
        isResolved: false,
        notes: "",
        phoneNumber: "",
        email: "",
        appearance: "",
        assignedOrg: "PADS Lake County",
      });

      if (reportFormRef.current?.resetToggles) {
        reportFormRef.current.resetToggles();
      }

      setSubmissionStatus(
        `Report successfully submitted. Your report ID is: ${reportId}`
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      setSubmissionStatus(
        "There was an error submitting the report. Please try again."
      );
    }
  };

  const renderContent = () => {
    switch (section) {
      case "map":
        return <Location />;
      case "resources":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl shadow-md p-6 transition duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-blue-50 cursor-pointer border border-gray-300 hover:border-blue-400"
              >
                <h2 className="text-lg font-bold text-blue-600 mb-2 group-hover:underline">
                  {resource.title}
                </h2>
                <p className="text-gray-700">{resource.description}</p>
                <p className="mt-4 text-sm text-blue-500 font-medium">
                  Click to visit website →
                </p>
              </a>
            ))}
          </div>
        );
      case "report":
      default:
        return (
          <ReportForm
            ref={reportFormRef}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submissionStatus={submissionStatus}
          />
        );
    }
  };

  return <ReportLayout>{renderContent()}</ReportLayout>;
};

export default ReportPage;
