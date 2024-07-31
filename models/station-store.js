import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { reportStore } from "./report-store.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(playlist) {
    await db.read();
    playlist._id = v4();
    db.data.stations.push(playlist);
    await db.write();
    return playlist;
  },

  async getStationById(id) {
    await db.read();
    const station = db.data.stations.find((playlist) => playlist._id === id);
    // list.tracks = await reportStore.getTracksByPlaylistId(list._id);
    return station;
  },

  async deletePlaylistById(id) {
    await db.read();
    const index = db.data.stations.findIndex((playlist) => playlist._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllPlaylists() {
    db.data.stations = [];
    await db.write();
  },
};
