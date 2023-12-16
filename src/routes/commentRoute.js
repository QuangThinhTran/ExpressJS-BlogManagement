import express from "express";
import { store } from "../controllers/CommentController.js";
import { checkToken } from "../config/jwt.js";
import { validateComment } from "../helper/validate.js";
import { upload } from "../helper/util.js";

const commentRoute = express.Router();

commentRoute.post("/create", checkToken, validateComment, store);

export default commentRoute;
