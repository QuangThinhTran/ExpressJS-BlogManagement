import express from "express";
import {
  detail,
  listPost,
  listSaved,
} from "../controllers/ProfileController.js";
import { checkToken } from "../config/jwt.js";
const profileRoute = express.Router();

profileRoute.get("/detail/:email", checkToken, detail);
profileRoute.get("/listPost", checkToken, listPost);
profileRoute.get("/listSaved", checkToken, listSaved);

export default profileRoute;
