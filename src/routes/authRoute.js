import express from "express";
import { checkToken } from "../config/jwt.js";
import { validateRegister, validateLogin } from "../helper/validate.js";
import { validationResult } from "express-validator";
import { register, login, logout } from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post("/register", validateRegister, register);
authRoute.post("/login", validateLogin, login);
authRoute.post("/logout", checkToken, logout);

export default authRoute;
