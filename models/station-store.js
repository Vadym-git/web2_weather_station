import { v4 } from "uuid";  // Import UUID library for generating unique identifiers.
import { initStore } from "../utils/store-utils.js";  // Import utility function for initializing the store.
import { reportStore } from "./report-store.js";  // Import report store for potential future use.

const db = initStore("stations");  // Initialize the store for handling station data.

export const stationStore = {

  // Retrieves all stations from the store.
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  // Retrieves all stations associated with a specific user ID.
  async getUserStations(userId) {
    await db.read();
    return db.data.stations.filter((station) => station.userId === userId);
  },

  // Adds a new station to the store.
  async addStation(station) {
    await db.read();
    station._id = v4();  // Generate a unique ID for the new station.
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  // Retrieves a specific station by its ID.
  async getStationById(id) {
    await db.read();
    const station = db.data.stations.find((station) => station._id === id);
    return station;
  },

  // Deletes a station by its ID.
  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },
};
