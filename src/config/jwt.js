import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (data) => {
  let token = jwt.sign({ data }, process.env.JWT_KEY, {
    algorithm: "HS256",
    expiresIn: "10m",
  });

  return token;
};

const verifyToken = (token) => {
  const verify = jwt.verify(
    token,
    process.env.JWT_KEY,
    function (err, decoded) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.log(err.expiredAt);
          return {
            code: 403,
            message: "Token expired. Please login again !!!",
          };
        } else {
          console.error(err.message, 123);
          return { code: 500, message: "Error verify token" };
        }
      } else {
        return decoded;
      }
    }
  );

  return verify;
};

const decodeToken = (token) => {
  let { code, message } = verifyToken(token);

  if (code == 403 || code == 500) {
    return false;
  }
  return jwt.decode(token);
};

const checkToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let { code, message } = verifyToken(token);
    if (code == 403) {
      res.status(code).send(message);
    } else if (code == 500) {
      res.status(code).send(message);
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(401).send("UnAuthorized");
  }
};

export { createToken, verifyToken, decodeToken, checkToken };
