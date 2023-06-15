import express from "express";
import UserController from "../../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/users/signup", UserController.signup);

userRoutes.post("/users/signin", UserController.signin);

userRoutes.get("/users", UserController.getOneById);

userRoutes.use("/users/availability_reset", UserController.resetAvailability);
export default userRoutes;
