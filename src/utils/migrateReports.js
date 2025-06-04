//Make all old entries have latitudes and longitudes
import { listenToReports, updateReport } from "../apis/firebaseService";
import { geocode } from "./geoCoding";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const migrateExistingReports = async () => {
  console.log("Starting migration...");

  try {
    // Get reports using listenToReports
    const reports = await new Promise((resolve) => {
      listenToReports((data) => {
        if (data) {
          const reportsArray = Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }));
          resolve(reportsArray);
        } else {
          resolve([]);
        }
      });
    });

    console.log(`Found ${reports.length} reports`);

    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      console.log(`Processing ${i + 1}/${reports.length}: ${report.id}`);

      // Skip if already has coordinates
      if (report.latitude && report.longitude) {
        skipped++;
        continue;
      }

      // Skip if no location
      if (!report.location?.trim()) {
        skipped++;
        continue;
      }

      try {
        const coords = await geocode(report.location, API_KEY);
        await updateReport(report.id, {
          latitude: coords.lat,
          longitude: coords.lng,
        });
        console.log(`Updated ${report.id}:`, coords);
        success++;

        // Rate limit delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed ${report.id}:`, error);
        failed++;
      }
    }

    console.log("Migration done!", { success, failed, skipped });
    return { success, failed, skipped };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
