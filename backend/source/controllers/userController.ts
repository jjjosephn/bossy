import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkUserExists = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {userId, firstName, lastName, email } = req.body;

  try {
   const existingUser = await prisma.user.findUnique({
      where: {
         userId: userId
      }
   })
   if (existingUser) {
      res.status(200).json({ exists: true, user: existingUser });
      return 
   } else {
      const newUser = await prisma.user.create({
         data: {
            userId,
            firstName,
            lastName,
            email
         }
      })
      res.status(200).json({ exists: false, user: newUser });
      return
   }
  } catch (error) {
      console.error("Error checking user existence:", error);
      res.status(500).json({ error: "Internal server error" });
   }
}
