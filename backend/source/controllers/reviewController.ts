import {Response, Request} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const newBossReview = async (
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

      if (review) {
         res.status(200).json({message: "Review created", review});
         const pendingReview = await prisma.pendingBossReviews.create({
            data: {
               reviewId: review.reviewId
            }
         })
         res.status(200).json({message: "Pending review created", pendingReview});
      }
   } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({message: "Internal server error"});
   }
}

export const getBossReviews = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {bossId} = req.params;
   try {
      const reviews = await prisma.bossReview.findMany({
         where: {
            bossId: bossId
         }
      });
      res.status(200).json(reviews);
   } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({message: "Internal server error"});
   }
}

export const newCompanyReview = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {reviewText, rating, term, userId, companyId} = req.body;
   try {
      const review = await prisma.companyReview.create({
         data: {
            reviewText,
            rating,
            term,
            userId,
            companyId
         }
      });

      if (review) {
         res.status(200).json({message: "Review created", review});
         const pendingReview = await prisma.pendingCompanyReviews.create({
            data: {
               reviewId: review.reviewId
            }
         })
         res.status(200).json({message: "Pending review created", pendingReview});
      }
   } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({message: "Internal server error"});
   }
}

export const getCompanyReviews = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {mapboxId} = req.params;
   try {
      const company = await prisma.company.findFirst({
         where: {
            mapboxId: mapboxId
         },
      })

      const reviews = await prisma.companyReview.findMany({
         where: {
            companyId: company?.companyId
         }
      });
      res.status(200).json(reviews);
   } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({message: "Internal server error"});
   }
}