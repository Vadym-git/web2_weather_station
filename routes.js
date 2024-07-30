import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationsController } from "./controllers/stations-controller.js";
import { aboutController } from "./controllers/about-controller.js";

export const router = express.Router();

router.get("/", dashboardController.index);
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addplaylist", dashboardController.addStation);
router.get("/station/:id", stationsController.index);
router.post("/station/:id/addtrack", stationsController.addTrack);
router.get("/about", aboutController.index);
