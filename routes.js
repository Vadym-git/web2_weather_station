import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationsController } from "./controllers/stations-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";

export const router = express.Router();

// dashboard
router.get("/", dashboardController.index);
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
// stations
router.get("/station/:id", stationsController.index);
router.post("/station/:id/addreport", stationsController.addReport);
// about
router.get("/about", aboutController.index);
//userpage
router.get("/user", accountsController.index);// <<<<
router.post("/user", accountsController.register);
router.post("/user/login", accountsController.authenticate);
router.get("/user/register", accountsController.signup);
