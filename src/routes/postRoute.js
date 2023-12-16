import express from "express";
import {
  detail,
  store,
  saved,
  destroy,
} from "../controllers/PostController.js";
import { checkToken } from "../config/jwt.js";
import { validatePost } from "../helper/validate.js";
import { upload } from "../helper/util.js";
const postRoute = express.Router();

postRoute.get("/:id", detail);
postRoute.post(
  "/create",
  checkToken,
  validatePost,
  upload.single("file"),
  store
);
postRoute.post("/saved", checkToken, saved);
postRoute.post("/delete", checkToken, destroy);

export default postRoute;
