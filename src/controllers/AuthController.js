import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken, decodeToken } from "../config/jwt.js";

const prisma = new PrismaClient();
const tokenBlacklist = new Set();

const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let hashPassword = bcrypt.hashSync(password, 10);
    let data = { username, email, password: hashPassword };

    let user = await prisma.users.create({
      data: data,
    });
    if (!user) {
      res.send("Failed to create");
    }
    res.status(201).send({
      user: {
        username: user.username,
        email: user.email,
        token: createToken({ user }),
      },
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await prisma.users.findFirst({
      where: { email: email },
    });

    if (!user) {
      res.send("Email is wrong");
    }

    let auth = bcrypt.compareSync(password, user.password);

    if (!auth) {
      res.send("Password is wrong");
    }

    res.status(200).send({
      user: {
        username: user.username,
        email: user.email,
        token: createToken({ user }),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    tokenBlacklist.add(token);

    if (tokenBlacklist.has(token)) {
      return res.status(200).send("Logout successful");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { register, login, logout };
