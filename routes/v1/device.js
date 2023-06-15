import express from "express";
import DeviceController from "../../controllers/deviceController.js";

const deviceRoutes = express.Router();

deviceRoutes.post("/devices", DeviceController.insertOne);
deviceRoutes.put("/devices/1", DeviceController.changeCurrentUserOnDevice);
deviceRoutes.get("/devices/1", DeviceController.getInformation);

export default deviceRoutes;
