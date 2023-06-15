import express from "express";
import { userRoutes } from "./user.js";

const v1Routes = express.Router();

v1Routes.use("/v1", userRoutes);

export default v1Routes;
