import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const index = async (req, res) => {
  try {
    let data = await prisma.posts.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    res.send(data);
  } catch (error) {
    await await prisma.$disconnect();
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const search = async (req, res) => {
  try {
    let data = await prisma.posts.findMany({
      where: {
        title: {
          startsWith: req.query.search,
        },
      },
      include: {
        user: true,
      },
    });
    res.status(200).send(data);
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { index, search };
