import express from "express";
import userRoutes from "./user.js";
import deviceRoutes from "./device.js";

const v1Routes = express.Router();

v1Routes.use("/v1", userRoutes, deviceRoutes);

export default v1Routes;
