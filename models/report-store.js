import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async addReport(stationtId, report) {
    await db.read();
    report._id = v4();
    report.stationId = stationtId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getReportByStationId(id) {
    await db.read();
    return db.data.reports.filter((station) => station.stationId === id);
  },

  async getTrackById(id) {
    await db.read();
    return db.data.reports.find((track) => track._id === id);
  },

  async deleteTrack(id) {
    await db.read();
    const index = db.data.reports.findIndex((track) => track._id === id);
    db.data.reports.splice(index, 1);
    await db.write();
  },

  async deleteAllTracks() {
    db.data.tracks = [];
    await db.write();
  },

  async updateTrack(track, updatedTrack) {
    track.title = updatedTrack.title;
    track.artist = updatedTrack.artist;
    track.duration = updatedTrack.duration;
    await db.write();
  },
};
