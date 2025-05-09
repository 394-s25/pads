import { database } from "../firebaseConfig";
import { ref, push } from "firebase/database"; // Import necessary Firebase functions


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

export async function writeReport(location, time, numPeople, emergencies, isResolved, notes, phoneNumber, email, appearance, assignedOrg) {
    try {
        const reportRef = ref(database, 'report');

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
        };

        await push(reportRef, reportData);

        console.log("Report successfully written to the database.");
    } catch (error) {
        console.error("Error writing report to the database:", error);
    }
}