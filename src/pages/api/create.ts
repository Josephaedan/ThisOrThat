import { LINKS } from "../../../public/LINKS";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req, res) {
  for (let i = 0; i < LINKS.length; i++) {
    const create = async () => {
      await prisma.picture.create({
        data: {
          name: "test",
          link: LINKS[i],
          score: 1600,
        },
      });
    };
    create();
  }
  res.status(200);
}
