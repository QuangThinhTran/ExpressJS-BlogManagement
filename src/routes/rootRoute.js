import express from "express";
import indexRoute from "./indexRoute.js";
import authRoute from "./authRoute.js";
import profileRoute from "./profileRoute.js";
import postRoute from "./postRoute.js";
import commentRoute from "./commentRoute.js";

const rootRoute = express.Router();

rootRoute.use("/", indexRoute);
rootRoute.use("/auth", authRoute);
rootRoute.use("/profile", profileRoute);
rootRoute.use("/post", postRoute);
rootRoute.use("/comment", commentRoute);

export default rootRoute;
