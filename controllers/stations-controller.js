import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import { config } from '../config.js';
import axios from "axios";

// The stationsController manages the operations related to individual weather stations.
export const stationsController = {

    // The index method displays the data for a specific station, including reports and user information.
    async index(request, response) {
        const station = await stationStore.getStationById(request.params.id);       // Get station by ID from the request parameters.
        const reports = await reportStore.getReportByStationId(request.params.id);  // Get all reports associated with the station.
        const apiKey = config.openWeatherMapApiKey;
        const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${station.latitude}&lon=${station.longitude}&units=metric&appid=${apiKey}`;
        // Calculate the maximum and minimum values for temperature, wind speed, and pressure.
        const maxT = await stationsController.getStationMaxTemp(reports);
        const minT = await stationsController.getStationMinTemp(reports);
        const maxW = await stationsController.getStationMaxWind(reports);
        const minW = await stationsController.getStationMinWind(reports);
        const maxP = await stationsController.getStationMaxPressure(reports);
        const minP = await stationsController.getStationMinPressure(reports);

        // Get the most recent report data.
        const currentReport = reports.reduce((latest, report) => {return !latest || report.time > latest.time ? report : latest;}, null);

        // Prepare the data to be sent to the view.
        const viewData = {
            station: station,
            reports: reports,
            maxT: maxT,
            minT: minT,
            maxW: maxW,
            minW: minW,
            maxP: maxP,
            minP: minP,
            currentTemp: currentReport ? currentReport.temp : "-",                    // Display current temperature or "-" if no data.
            currentTempF: currentReport ? currentReport.temp * 1.8 + 32 : "-",        // Convert temperature to Fahrenheit.
            currentWind: currentReport ? currentReport.wind_speed : "-",              // Display current wind speed or "-" if no data.
            currentWindD: currentReport ? currentReport.direction : "-",              // Display current wind direction or "-" if no data.
            currentPress: currentReport ? currentReport.pressure : "-",               // Display current pressure or "-" if no data.
            user: await accountsController.getLoggedInUser(request),                  // Get the logged-in user.
            description: currentReport ? currentReport.description : "-",
            filsLike: currentReport ? currentReport.tempFils : "-"
        };
        try {
            // Fetch data from OpenWeatherMap API
            const result = await axios.get(weatherRequestUrl);
            if (result.status === 200) {
                viewData.chart = result.data.list;
            };
        } catch (error) {
            console.error("Error fetching data from OpenWeatherMap API:", error);
        };
        // If the user is logged in, render the station view; otherwise, redirect to the login page.
        if (viewData.user) {
            response.render("station-view", viewData);
        } else {
            response.redirect("/user");
        }
    },

    // The deleteStation method deletes a station and its associated reports.
    async deleteStation(request, response) {
        await reportStore.getReportByStationId(request.params.id);                  // Get all reports for the station to delete.
        await stationStore.deleteStationById(request.params.id);                    // Delete the station by ID.
        response.redirect("/"); // Redirect to the homepage after deletion.
    },

    // The deleteReport method deletes a specific report from a station.
    async deleteReport(request, response) {
        await reportStore.deleteReportById(request.body.r_id);                      // Delete the report by its ID.
        response.redirect("/station/" + request.params.id);                         // Redirect back to the station page.
    },

    // The deleteReportsByStationId method deletes all reports associated with a specific station.
    async deleteReportsByStationId(request, response) {
        const reports = await reportStore.getReportByStationId(request.params.id);  // Get all reports for the station.
        if (reports.length > 0) {
            // Loop through each report and delete it.
            reports.forEach(async (report) => {
                await reportStore.deleteReportById(report._id);
            });
        }
    },

    // Method to get the maximum pressure recorded at the station.
    async getStationMaxPressure(reports) {
        if (reports.length === 0) {
            return "-"; // Return "-" if there are no reports.
        }
        let maxP = reports[0].pressure;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].pressure > maxP) {
                maxP = reports[i].pressure;
            }
        }
        return maxP; // Return the maximum pressure value.
    },

    // Method to get the minimum pressure recorded at the station.
    async getStationMinPressure(reports) {
        if (reports.length === 0) {
            return "-"; // Return "-" if there are no reports.
        }
        let minP = reports[0].pressure;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].pressure < minP) {
                minP = reports[i].pressure;
            }
        }
        return minP; // Return the minimum pressure value.
    },

    // Method to get the maximum wind speed recorded at the station.
    async getStationMaxWind(reports) {
        if (reports.length === 0) {
            return "-"; // Return "-" if there are no reports.
        }
        let maxW = reports[0].wind_speed;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].wind_speed > maxW) {
                maxW = reports[i].wind_speed;
            }
        }
        return maxW; // Return the maximum wind speed value.
    },

    // Method to get the minimum wind speed recorded at the station.
    async getStationMinWind(reports) {
        if (reports.length === 0) {
            return "-"; // Return "-" if there are no reports.
        }
        let minW = reports[0].wind_speed;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].wind_speed < minW) {
                minW = reports[i].wind_speed;
            }
        }
        return minW; // Return the minimum wind speed value.
    },

    // Method to get the maximum temperature recorded at the station.
    async getStationMaxTemp(reports) {
        if (reports.length === 0) {
            return "-"; // Return "-" if there are no reports.
        }
        let maxT = reports[0].temp;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].temp > maxT) {
                maxT = reports[i].temp;
            }
        }
        return maxT; // Return the maximum temperature value.
    },

    // Method to get the minimum temperature recorded at the station.
    async getStationMinTemp(reports) {
        if (reports.length === 0) {
            return "-"; // Return "-" if there are no reports.
        }
        let minT = reports[0].temp;
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].temp < minT) {
                minT = reports[i].temp;
            }
        }
        return minT; // Return the minimum temperature value.
    },

    // The addReport method adds a new weather report to a station.
    async addReport(request, response) {
        const station = await stationStore.getStationById(request.params.id);       // Get the station by ID.
        const newReport = {
            code: request.body.code,                                                  // Get the report code from the request body.
            temp: Number(request.body.temp),                                          // Convert and get the temperature from the request body.
            wind_speed: Number(request.body.wind_speed),                              // Convert and get the wind speed from the request body.
            pressure: Number(request.body.pressure),                                  // Convert and get the pressure from the request body.
            direction: request.body.direction,                                        // Get the wind direction from the request body.
            date: new Date().toISOString()                                            // Set the current date and time.
        };

        // If the report code exists, add the report to the station.
        if (newReport.code) {
            console.log(`Adding report with code ${newReport.code} to station ${station._id}`);
            await reportStore.addReport(station._id, newReport);                      // Add the new report to the store.
        } else {
            console.log('Report not added: code is missing.');                        // Log if the report code is missing.
        }
        response.redirect("/station/" + station._id);                               // Redirect back to the station page.
    },

    async generateReport(request, response){
        const apiKey = config.openWeatherMapApiKey;
        const station = await stationStore.getStationById(request.params.id);
        const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${station.latitude}&lon=${station.longitude}&units=metric&appid=${apiKey}`;
        try {
            // Fetch data from OpenWeatherMap API
            const result = await axios.get(weatherRequestUrl);
            if (result.status === 200) {
                const currentWeather = result.data;
                // Construct new station object using the data from OpenWeatherMap API
                const newReport = {
                    code: currentWeather.weather[0].id,
                    temp: currentWeather.main.temp,
                    tempFils: currentWeather.main.feels_like,
                    wind_speed: currentWeather.wind.speed,
                    pressure: currentWeather.main.pressure,
                    direction: currentWeather.wind.deg,
                    description: currentWeather.weather[0].description,
                    date: new Date().toISOString()
                };
                // Add the station to the store
                await reportStore.addReport(station._id, newReport);
            } else {
                console.log("Failed to fetch data from OpenWeatherMap API.");
            }
        } catch (error) {
            console.error("Error fetching data from OpenWeatherMap API:", error);
        }
        response.redirect("/station/" + station._id);
    }

};
