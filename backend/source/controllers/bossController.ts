import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addBossRequest = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { userId, bossFirstName, bossLastName, position, companyId } = req.body;
      
   try {
      const bossRequest = await prisma.pendingBosses.create({
         data: {
            userId,
            bossFirstName,
            bossLastName,
            position,
            companyId
         }
      });
      res.status(200).json({ message: "Boss request added", bossRequest });
   } catch (error) {
      console.error("Error adding boss request:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}