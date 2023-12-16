import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const detail = async (req, res) => {
  try {
    let email = req.params.email;

    let data = await prisma.users.findUnique({
      where: { email },
      select: {
        username: true,
        email: true,
      },
    });

    return !data ? res.status(404).send("Not Found" + email) : res.send(data);
  } catch (error) {
    await prisma.$disconnect;
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const listPost = async (req, res) => {
  try {
    let userId = req.body.id;
    let data = await prisma.posts.findMany({
      where: {
        user_id: parseInt(userId),
      },
      select: {
        title: true,
        image: true,
        timestamp: true,
      },
    });

    res.send(data);
  } catch (error) {
    await prisma.$disconnect;
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const listSaved = async (req, res) => {
  try {
    let userId = req.body.id;
    let data = await prisma.saved.findMany({
      where: {
        user_id: parseInt(userId),
      },
      select: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        post: {
          select: {
            title: true,
            image: true,
            timestamp: true,
          },
        },
      },
    });

    res.send(data);
  } catch (error) {
    await prisma.$disconnect;
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { detail, listPost, listSaved };
