import { database } from "../firebaseConfig";
import { ref, push, onValue, get, set, update} from "firebase/database"; // Import necessary Firebase functions

/*
    * Function to write a report to the Firebase Realtime Database
    * @param {string} location - The location of the incident
    * @param {string} time - The time of the incident
    * @param {number} numPeople - The number of people involved
    * @param {string} emergencies - The type of emergencies reported (A dropdown like skills in ignite)
    * @param {boolean} isResolved - Whether the incident is resolved or not
    * @param {string} notes - Additional notes about the incident
    * @param {string} phoneNumber - Contact phone number (Optional)
    * @param {string} email - Contact email address (Optional)
    * @param {string} appearance - Description of the appearance of individuals involved
    * @param {string} assignedOrg - Organization assigned to handle the report
*/
export async function writeReport(location, time, numPeople, emergencies, isResolved, notes, phoneNumber, email, appearance, assignedOrg, mediaUrls) {
    try {
        const reportRef = ref(database, 'report');

        // make new report with a unique ID
        const newReportRef = push(reportRef);
        const reportId = newReportRef.key;

        const reportData = {
            location,
            time,
            numPeople,
            emergencies,
            isResolved,
            notes,
            phoneNumber,
            email,
            appearance,
            assignedOrg,
            id: reportId, // add id for searching
            mediaUrls: mediaUrls || []
        };

        await set(newReportRef, reportData); // use set to write full data

        console.log("Report written with ID:", reportId);
        return reportId; // return the ID so the caller can use/display it
    } catch (error) {
        console.error("Error writing report:", error);
        throw error;
    }
}

/**
 * Function to listen to changes in the reports table
 * @param {function} callback - A function to handle the updated reports data
 */
export function listenToReports(callback) {
    try {
        const reportRef = ref(database, 'report');

        onValue(reportRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });

        console.log("Listening to changes in the reports table.");
    } catch (error) {
        console.error("Error listening to reports:", error);
    }
}

/**
 * Function to get a list of emergency names based on provided indices
 * @param {Array<number>} indices - List of indices to fetch emergency names
 * @returns {Promise<Array<string>>} - A promise that resolves to a list of emergency names
 */
export async function getEmergencyNamesByIndices(indices) {
    try {
        const emergenciesRef = ref(database, 'Emergencies');

        const snapshot = await get(emergenciesRef);
        const emergencies = snapshot.val();

        if (!emergencies) {
            throw new Error("Emergencies table is empty or does not exist.");
        }

        const emergencyNames = indices.map(index => emergencies[index]);

        console.log("Fetched emergency names:", emergencyNames);
        return emergencyNames;
    } catch (error) {
        console.error("Error fetching emergency names:", error);
        throw error;
    }
}

export async function getAllEmergencyNames() {
    try {
        const emergenciesRef = ref(database, 'Emergencies');

        const snapshot = await get(emergenciesRef);
        const emergencies = snapshot.val();
        
        if (!emergencies) {
            throw new Error("Emergencies table is empty or does not exist.");
        }

        const emergencyNames = Object.values(emergencies);
        console.log("Fetched all emergency names: ", emergencyNames);
        return emergencyNames;
    } catch (error) {
        console.error("Error fetching all emergency names:", error);
        throw error;
    }
}

export async function getIndexByEmergencyName(emergency) {
    try {
        const emergenciesRef = ref(database, 'Emergencies');

        const snapshot = await get(emergenciesRef);
        const emergencies = snapshot.val();
        
        if (!emergencies) {
            throw new Error("Emergencies table is empty or does not exist.");
        }

        const index = Object.keys(emergencies).find(
            key => emergencies[key] === emergency
        );

        if (index === undefined) {
            throw new Error(`Emergency name "${emergency}" not found.`);
        }
        return index;
    } catch (error) {
        console.error("Error fetching index:", error);
        throw error;
    }
}

export async function getReportById(reportId) {
    try {
        const singleReportRef = ref(database, `report/${reportId}`);
        const snapshot = await get(singleReportRef);

        if (!snapshot.exists()) {
            throw new Error("No report found with ID: " + reportId);
        }

        return snapshot.val();
    } catch (error) {
        console.error("Error retrieving report by ID:", error);
        throw error;
    }
}

export async function updateIsResolved(reportId, isResolved) {
    try {
        const reportRef = ref(database, `report/${reportId}`);
        await update(reportRef, { isResolved });
        console.log(`Successfully updated isResolved to ${isResolved} for report ID: ${reportId}`);
    } catch (error) {
        console.error("Error updating isResolved:", error);
        throw error;
    }
}