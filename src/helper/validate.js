import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const validateRegister = [
  body("username").notEmpty().withMessage("username is required"),
  body("email").notEmpty().withMessage("email is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("password is required"),
  body("password")
    .isLength({
      min: 6,
    })
    .withMessage("password more than 6 character"),
  body("confirm_password")
    .not()
    .isEmpty()
    .withMessage("confirm_password is required"),
  body("confirm_password")
    .isLength({
      min: 6,
    })
    .withMessage("confirm_password more than 6 character"),
  async function (req, res, next) {
    const errors = validationResult(req);

    let checkEmail = await prisma.users.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (checkEmail) {
      res.status(422).send(`email ${checkEmail.email} has already been`);
    } else if (req.body.password !== req.body.confirm_password) {
      res.status(422).send("confirm_password incorrect");
    } else if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
    } else {
      next();
    }
  },
];

const validateLogin = [
  body("email").notEmpty().withMessage("username is required"),
  body("password").notEmpty().withMessage("password is required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
      return;
    }
    next();
  },
];

const validateComment = [
  body("content").notEmpty().withMessage("content is required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
      return;
    }
    next();
  },
];

const validatePost = [
  body("title").notEmpty().withMessage("title is required"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({ errors: errors.array() });
      return;
    }
    next();
  },
];

export { validateRegister, validateLogin, validateComment, validatePost };
