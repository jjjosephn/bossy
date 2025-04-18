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

export const getBosses = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {mapboxId} = req.params

   try {
      const company = await prisma.company.findFirst({
         where: {
            mapboxId
         }
      })

      if (!company) {
         res.status(404).json({ message: "Company not found" });
         return 
      } else {
         const bosses = await prisma.boss.findMany({
            where: {
               companyId: company.companyId
            }
         });
         res.status(200).json(bosses);
         return
      }
   } catch (error) {
      console.error("Error fetching bosses:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

export const getBossInfo = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {bossId} = req.params
   
   try {
      const boss = await prisma.boss.findUnique({
         where: {
            bossId
         },
         include: {
            Company: true,
         }
      })
      res.status(200).json(boss);
      return
   } catch (error) {
      console.error("Error fetching boss info:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
