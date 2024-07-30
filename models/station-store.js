import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { trackStore } from "./track-store.js";

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
    const list = db.data.stations.find((playlist) => playlist._id === id);
    list.tracks = await trackStore.getTracksByPlaylistId(list._id);
    return list;
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
