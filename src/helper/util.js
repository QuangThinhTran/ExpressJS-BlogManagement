import multer, { diskStorage } from "multer";
import { decodeToken } from "../config/jwt.js";

export const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/image", // đường dẫn mà file sẽ được lưu
    filename: (req, file, callback) =>
      callback(null, new Date().getTime() + "_" + file.originalname), // đổi tên file
  }),
});

export const checkLogin = (token) => {
  if (!token) {
    return false;
  }
  let result = decodeToken(token.split(" ")[1]);
  return result ? result : null;
};
