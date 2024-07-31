import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const stationsController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const reports = await reportStore.getReportByStationId(request.params.id);
    const viewData = {
      station: station,
      reports: reports,
    };
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReport = {
      title: request.body.title,
      temp: Number(request.body.temp),
      wind_speed: Number(request.body.wind_speed),
      pressure: Number(request.body.pressure),
    };
    console.log(`adding report ${newReport.title}`);
    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },
};
