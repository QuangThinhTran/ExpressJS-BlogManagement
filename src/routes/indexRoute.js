import express from "express";
import { index, search } from "../controllers/HomeController.js";

const indexRoute = express.Router();

indexRoute.get("", index);
indexRoute.get("/search", search);

export default indexRoute;
