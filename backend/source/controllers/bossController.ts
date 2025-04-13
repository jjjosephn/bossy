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

export const getPendingBosses = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const pendingBosses = await prisma.pendingBosses.findMany({
         include: {
            User: true,
            Company: true,
         }
      });
      res.status(200).json(pendingBosses);
   } catch (error) {
      console.error("Error fetching pending bosses:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

export const acceptBossRequest = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { bossFirstName, bossLastName, position, companyId, userId, pendingId, status } = req.body

   try {
      const newBoss = await prisma.boss.create({
         data: {
            bossFirstName,
            bossLastName,
            position,
            companyId
         }
      })

      const newArchivedForm = await prisma.archivedForms.create({
         data: {
            userId,
            bossFirstName,
            bossLastName,
            position,
            companyId,
            status
         }
      })

      const deleted = await prisma.pendingBosses.delete({
         where: {
            pendingId
         }
      })

      res.status(200).json({ message: "Boss request accepted", newBoss, newArchivedForm, deleted });
   } catch (error) {
      console.error("Error accepting boss request:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}

export const declineBossRequest = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { bossFirstName, bossLastName, position, companyId, userId, pendingId, status } = req.body

   try {
      const newArchivedForm = await prisma.archivedForms.create({
         data: {
            userId,
            bossFirstName,
            bossLastName,
            position,
            companyId,
            status
         }
      })
      const deleted = await prisma.pendingBosses.delete({
         where: {
            pendingId
         }
      })

      res.status(200).json({ message: "Boss request declined", newArchivedForm, deleted });
   } catch (error) {
      console.error("Error declining boss request:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}
