import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Location from "../components/Location";
import { writeReport } from "../apis/firebaseService";
import ReportForm from "../components/ReportForm";
import ReportLayout from "../components/ReportLayout";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Clipboard } from "lucide-react";
import { geocode } from "../utils/geoCoding";

const ReportPage = () => {
  const { section } = useParams(); // 'report', 'map', or 'resources'
  const [copied, setCopied] = useState(false);
  const [resources, setResources] = useState([]);
  const [reportId, setReportId] = useState("");
  const [formData, setFormData] = useState({
    location: "",
    latitude: null,
    longitude: null,
    time: "",
    numPeople: 0,
    emergencies: "",
    isResolved: null,
    notes: "",
    phoneNumber: "",
    email: "",
    appearance: "",
    assignedOrg: "PADS Lake County",
    mediaUrls: [],
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
  /*
   * original code
   *
   */
  // const handleChange = (event) => {
  //     const { name, value } = event.target;
  //     setFormData((prev) => ({...prev, [name]: value}));
  //     console.log(formData);
  // };
  const handleChange = (event) => {
    const name = event.target?.name;
    const value = event.target?.value;

    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("Changed:", name, value);
  };

  const handleSubmit = async (formData, selectedFiles) => {
    try {
      let finalFormData = { ...formData };

      if (formData.location && formData.location.trim() !== "") {
        console.log("Geocoding address on submission:", formData.location);
        try {
          const coords = await geocode(
            formData.location,
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          );
          finalFormData.latitude = coords.lat;
          finalFormData.longitude = coords.lng;
          console.log("Geocoded coordinates:", coords);
        } catch (error) {
          console.warn(
            "Failed to geocode address, submitting without coordinates:",
            error
          );

          finalFormData.latitude = null;
          finalFormData.longitude = null;
        }
      } else {
        // No location provided
        finalFormData.latitude = null;
        finalFormData.longitude = null;
      }

      const storage = getStorage();
      const uploadPromises = selectedFiles.map(async (file) => {
        const uniqueName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, uniqueName);
        console.log("uploading file: ", uniqueName);
        await uploadBytes(storageRef, file).then((snapshot) => {
          console.log(`Uploaded file ${uniqueName}!`);
        });
        return await getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      const fullFormData = {
        ...finalFormData,
        mediaUrls: [...(finalFormData.mediaUrls || []), ...urls],
      };

      console.log("Final form data submitted:", {
        location: fullFormData.location,
        latitude: fullFormData.latitude,
        longitude: fullFormData.longitude,
      });

      const reportId = await writeReport(...Object.values(fullFormData));

      setFormData({
        location: "",
        latitude: null,
        longitude: null,
        time: "",
        numPeople: 0,
        emergencies: "",
        isResolved: null,
        notes: "",
        phoneNumber: "",
        email: "",
        appearance: "",
        assignedOrg: "PADS Lake County",
        mediaUrls: [],
      });

      if (reportFormRef.current?.resetToggles) {
        reportFormRef.current.resetToggles();
      }

      setReportId(reportId);
      setSubmissionStatus("Report successfully submitted.");
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
          <>
            <ReportForm
              ref={reportFormRef}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              submissionStatus={submissionStatus}
            />

            {submissionStatus && (
              <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700 font-medium space-y-2">
                <p>{submissionStatus}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span>Your report ID is:</span>
                  <span className="bg-blue-100 px-2 py-1 rounded font-mono">
                    {reportId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(reportId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-green-600 hover:text-indigo-800 transition"
                    title="Copy to clipboard"
                  >
                    <Clipboard className="w-5 h-5" />
                    <span className="text-sm font-normal">Copy ID</span>
                  </button>
                  {copied && (
                    <span className="text-sm text-green-600">Copied!</span>
                  )}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return <ReportLayout>{renderContent()}</ReportLayout>;
};

export default ReportPage;
