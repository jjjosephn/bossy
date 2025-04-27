import {Response, Request} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const newReview = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {reviewText, rating, term, userId, bossId} = req.body;
   try {
      const review = await prisma.bossReview.create({
         data: {
            reviewText,
            rating,
            term,
            userId,
            bossId
         }
      });
      res.status(200).json({message: "Review created", review});
   } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({message: "Internal server error"});
   }
}