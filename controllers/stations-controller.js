import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";

export const stationsController = {
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);
        const reports = await reportStore.getReportByStationId(request.params.id);
        const maxT = await stationsController.getStationMaxTemp(reports);
        const minT = await stationsController.getStationMinTemp(reports);
        const maxW = await stationsController.getStationMaxWind(reports);
        const minW = await stationsController.getStationMinWind(reports);
        const maxP = await stationsController.getStationMaxPressure(reports);
        const minP = await stationsController.getStationMinPressure(reports);
        const viewData = {
            station: station,
            reports: reports,
            maxT: maxT,
            minT: minT,
            maxW: maxW,
            minW: minW,
            maxP: maxP,
            minP: minP,
            user: await accountsController.getLoggedInUser(request)
        };
        if (viewData.user){
            response.render("station-view", viewData);
        } else {
            response.redirect("/user");
        }
    },

    async getStationMaxPressure(reports){
        if (reports.length === 0){
            return "-"
        }
        let maxP = reports[0].pressure;
        for (let i=0; i < reports.length; i++){
            if (reports[i].pressure > maxP){
                maxP = reports[i].pressure;
            }
        }
        return maxP;
    },

    async getStationMinPressure(reports){
        if (reports.length === 0){
            return "-"
        }
        let minP = reports[0].pressure;
        for (let i=0; i < reports.length; i++){
            if (reports[i].pressure < minP){
                minP = reports[i].pressure;
            }
        }
        return minP;
    },

    async getStationMaxWind(reports){
        if (reports.length === 0){
            return "-"
        }
        let maxW = reports[0].wind_speed;
        for (let i=0; i < reports.length; i++){
            if (reports[i].wind_speed > maxW){
                maxW = reports[i].wind_speed;
            }
        }
        return maxW;
    },

    async getStationMinWind(reports){
        if (reports.length === 0){
            return "-"
        }
        let minW = reports[0].wind_speed;
        for (let i=0; i < reports.length; i++){
            if (reports[i].wind_speed < minW){
                minW = reports[i].wind_speed;
            }
        }
        return minW;
    },

    async getStationMaxTemp(reports){
        if (reports.length === 0){
            return "-"
        }
        let maxT = reports[0].temp;
        for (let i=0; i < reports.length; i++){
            if (reports[i].temp > maxT){
                maxT = reports[i].temp;
            }
        }
        return maxT;
    },

    async getStationMinTemp(reports){
        if (reports.length === 0){
            return "-"
        }
        let minT = reports[0].temp;
        for (let i=0; i < reports.length; i++){
            if (reports[i].temp < minT){
                minT = reports[i].temp;
            }
        }
        return minT;
    },

    async addReport(request, response) {
      const station = await stationStore.getStationById(request.params.id);
      const newReport = {
        code: request.body.code,
        temp: Number(request.body.temp),
        wind_speed: Number(request.body.wind_speed),
        pressure: Number(request.body.pressure),
        direction: request.body.direction,
      };

      // Check if 'code' is provided (not null or undefined)
      if (newReport.code) {
        console.log(`Adding report with code ${newReport.code} to station ${station._id}`);
        await reportStore.addReport(station._id, newReport);
      } else {
        console.log('Report not added: code is missing.');
      }
      response.redirect("/station/" + station._id);
    },
};
