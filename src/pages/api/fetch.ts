import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const fetch = async () => {
        const results = await prisma.picture.findMany();
        console.log(results);
        return results;
    }
    const results = await fetch();
    res.status(200).json(results);
  }