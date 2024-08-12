import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");                                                // Initialize the store for handling report data.

export const reportStore = {
  // Retrieves all reports from the store.
  async getAllReports() {
    await db.read();                                                            // Read data from the store.
    return db.data.reports;                                                     // Return the list of reports.
  },

  // Adds a new report to the store.
  async addReport(stationId, report) {
    await db.read();                                                            // Read data from the store.
    report._id = v4();                                                          // Generate a unique ID for the new report.
    report.stationId = stationId;                                               // Assign the station ID to the report.
    db.data.reports.push(report);                                               // Add the new report to the list of reports.
    await db.write();                                                           // Write the updated list back to the store.
    return report;                                                              // Return the newly added report.
  },

  // Retrieves reports associated with a specific station ID.
  async getReportByStationId(id) {
    await db.read();                                                            // Read data from the store.
    return db.data.reports.filter((report) => report.stationId === id);         // Filter and return reports by station ID.
  },

  // Deletes a report by its ID.
  async deleteReportById(id) {
    await db.read();                                                            // Read data from the store.
    const index = db.data.reports.findIndex((report) => report._id === id);     // Find the index of the report to be deleted.
    db.data.reports.splice(index, 1);                                           // Remove the report from the list.
    await db.write();                                                           // Write the updated list back to the store.
  },
};
