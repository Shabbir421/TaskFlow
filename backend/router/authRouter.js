/** @format */

import express from "express";
import { signin, signout, signup } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", signup);
authRouter.post("/signout", signout);
authRouter.post("/login", signin);
export default authRouter;
