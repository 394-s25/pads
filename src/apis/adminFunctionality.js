import { database } from "../firebaseConfig";
import { ref, push, onValue, get } from "firebase/database";
import { getEmergencyNamesByIndices } from "./firebaseService";

// given id, pull up individual report
export const getReport = async (reportId) => {
  try {
    const reportRef = ref(database, `report/${reportId}`);
    const snapshot = await get(reportRef);

    if (snapshot.exists()) {
      const reportData = snapshot.val();
      const emergencyNames = await getEmergencyNamesByIndices(
        reportData.emergencies || []
      );
      return { ...reportData, emergencyNames };
    } else {
      console.error("Report not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting report:", error);
    return null;
  }
};
