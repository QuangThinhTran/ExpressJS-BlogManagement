import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const store = async (req, res) => {
  try {
    let { content, user_id, post_id } = req.body;
    let comment = await prisma.comments.create({
      data: {
        content: content,
        user_id: parseInt(user_id),
        post_id: parseInt(post_id),
        timestamp: new Date(),
      },
    });

    return !comment
      ? res.send("Created failed")
      : res.status(201).send("Created successfully");
  } catch (error) {
    await prisma.$disconnect;
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { store };
