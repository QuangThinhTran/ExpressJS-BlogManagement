import { PrismaClient } from "@prisma/client";
import { checkLogin } from "../helper/util.js";
import { decodeToken } from "../config/jwt.js";

const prisma = new PrismaClient();

const detail = async (req, res) => {
  try {
    let token = req.headers.authorization;
    const isLogin = checkLogin(token);

    let data = await prisma.posts.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        title: true,
        image: true,
        timestamp: true,
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    let comment = await prisma.comments.findMany({
      where: {
        post_id: parseInt(req.params.id),
      },
      select: {
        content: true,
        image: true,
        timestamp: true,
      },
    });

    if (!data) {
      res.status(404).send("Not Found");
    }

    if (!isLogin) {
      res.status(200).send({ data, comment });
    } else {
      let checkSave = await prisma.saved.findFirst({
        where: {
          user_id: isLogin.data.user.id,
          post_id: parseInt(req.params.id),
        },
      });

      return !checkSave
        ? res.send({ data, save: false, comment })
        : res.send({ data, save: true, comment });
    }
  } catch (error) {
    await prisma.$disconnect;
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const store = async (req, res) => {
  try {
    let { title, user_id } = req.body;
    let post = await prisma.posts.create({
      data: {
        title: title,
        user_id: parseInt(user_id),
        timestamp: new Date(),
      },
    });

    if (!post) {
      res.send("Created failed");
    }

    res.send({
      title: post.title,
      user_id: post.user_id,
      timestamp: post.timestamp,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const saved = async (req, res) => {
  try {
    let { user_id, post_id } = req.body;

    let saved = await prisma.saved.findFirst({
      where: {
        user_id: parseInt(user_id),
        post_id: parseInt(post_id),
      },
    });

    if (saved != null) {
      res.send("Post is saved");
      return;
    }
    let save = await prisma.saved.create({
      data: {
        user_id: parseInt(user_id),
        post_id: parseInt(post_id),
        timestamp: new Date(),
      },
    });

    return !save
      ? res.send("Saved failed")
      : res.status(201).send("Saved successfully");
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const destroy = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let result = decodeToken(token);
    console.log(req.body.id);
    let data = await prisma.posts.delete({
      where: {
        id: parseInt(req.body.id),
        user_id: result.data.user.id,
      },
    });

    return data ? res.send(data) : res.status(404).send("Not Found");
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { detail, store, destroy, saved };
