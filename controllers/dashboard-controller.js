import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { stationsController } from "./stations-controller.js";
import { reportStore } from "../models/report-store.js";
import { config } from '../config.js';
import axios from "axios";

// The dashboardController manages the display and interaction with the user's stations dashboard.
export const dashboardController = {
    // The index method renders the dashboard view, showing all stations and user information.
    async index(request, response) {
        const viewData = {
            title: "Stations Dashboard",                                              // Set the title for the dashboard page.
            stations: await dashboardController.collectAllUserStationsData(request),  // Collect all station data for the logged-in user.
            user: await accountsController.getLoggedInUser(request)                   // Get the currently logged-in user.
        };
        response.render("dashboard-view", viewData);                                // Render the dashboard view with the provided data.
    },

    // The addStation method adds a new station to the user's list.
    async addStation(request, response) {
        const newStation = {
            title: request.body.title,                                          // Get the station title from the request body.
            latitude: request.body.latitude,                                    // Get the station latitude from the request body.
            longitude: request.body.longitude,                                  // Get the station longitude from the request body.
            userId: request.body.userId,                                        // Get the user ID from the request body.
            date: new Date().toISOString()                                      // Set the current date and time.
        };
        await stationStore.addStation(newStation);                              // Add the new station to the station store.
        response.redirect("/dashboard");                                        // Redirect to the dashboard page after adding the station.
    },

    // The collectAllUserStationsData method gathers all stations data for the logged-in user.
    async collectAllUserStationsData(request) {
        const user = await accountsController.getLoggedInUser(request);         // Get the logged-in user.
        if (!user) { return null; }                                             // If no user is logged in, return null.
        const stationsList = await stationStore.getUserStations(user._id);      // Get all stations for the user.
        let stationsData = [];
        // Loop through each station and collect relevant data.
        for (let i = 0; i < stationsList.length; i++) {
            const reports = await reportStore.getReportByStationId(stationsList[i]._id);    // Get all reports for the current station.
            const currentData = reports.reduce((latest, report) => {return !latest || report.time > latest.time ? report : latest;}, null);                                // Get the most recent report data.
            // Create a station object with all relevant data, including temperature, wind, and pressure information.
            let station = {
                title: stationsList[i].title,                                   // Station title.
                latitude: stationsList[i].latitude,                             // Station latitude.
                longitude: stationsList[i].longitude,                           // Station longitude.
                currentTemp: currentData ? currentData.temp : "-",              // Current temperature or "-" if no data.
                currentTempF: currentData ? currentData.temp * 1.8 + 32 : "-",  // Current temperature in Fahrenheit or "-" if no data.
                currentWind: currentData ? currentData.wind_speed : "-",        // Current wind speed or "-" if no data.
                currentWindD: currentData ? currentData.direction : "-",        // Current wind direction or "-" if no data.
                currentPress: currentData ? currentData.pressure : "-",         // Current pressure or "-" if no data.
                description: currentData ? currentData.description : "-",
                filsLike: currentData ? currentData.tempFils : "-",
                maxT: await stationsController.getStationMaxTemp(reports),      // Maximum recorded temperature for the station.
                minT: await stationsController.getStationMinTemp(reports),      // Minimum recorded temperature for the station.
                maxW: await stationsController.getStationMaxWind(reports),      // Maximum recorded wind speed for the station.
                minW: await stationsController.getStationMinWind(reports),      // Minimum recorded wind speed for the station.
                maxP: await stationsController.getStationMaxPressure(reports),  // Maximum recorded pressure for the station.
                minP: await stationsController.getStationMinPressure(reports),  // Minimum recorded pressure for the station.
                _id: stationsList[i]._id                                        // Station ID.
            };
            stationsData.push(station);                                         // Add the station data to the list.
        }
        // Sort the stations alphabetically by title.
        stationsData.sort((a, b) => a.title.localeCompare(b.title));
        return stationsData;                                                    // Return the sorted list of stations.
    },

    // Function to add a station using data from OpenWeatherMap API
    async addStationFromOpenWeather(request, response) {
        const apiKey = config.openWeatherMapApiKey;
        const cityName = request.body.title;                                    // Assuming the city name is provided in the request body
        const cityCountry = request.body.country;                                  // Assuming the country name is provided in the request body
        const weatherRequestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
        try {
            // Fetch data from OpenWeatherMap API
            const result = await axios.get(weatherRequestUrl);

            if (result.status === 200) {
                const currentWeather = result.data;
                // Construct new station object using the data from OpenWeatherMap API
                const newStation = {
                    title: cityName,
                    latitude: currentWeather.coord.lat,
                    longitude: currentWeather.coord.lon,
                    userId: request.body.userId,
                    date: new Date().toISOString()
                };
                // Add the station to the store
                await stationStore.addStation(newStation);
                // Redirect to the dashboard after adding the station
                response.redirect("/dashboard");
            } else {
                console.log("Failed to fetch data from OpenWeatherMap API.");
                response.redirect("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching data from OpenWeatherMap API:", error);
            response.redirect("/dashboard");
        }
    },
};
