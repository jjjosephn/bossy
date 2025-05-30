import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPendingBosses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pendingBosses = await prisma.pendingBosses.findMany({
      include: {
        User: true,
        Company: true,
      },
    });
    res.status(200).json(pendingBosses);
  } catch (error) {
    console.error("Error fetching pending bosses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptBossRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    bossFirstName,
    bossLastName,
    position,
    companyId,
    userId,
    pendingId,
    status,
    requestedDate,
  } = req.body;

  try {
    const newBoss = await prisma.boss.create({
      data: {
        bossFirstName,
        bossLastName,
        position,
        companyId,
      },
    });

    const newArchivedForm = await prisma.archivedForms.create({
      data: {
        userId,
        bossFirstName,
        bossLastName,
        position,
        companyId,
        status,
        requestedDate,
      },
    });

    const deleted = await prisma.pendingBosses.delete({
      where: {
        pendingId,
      },
    });

    res
      .status(200)
      .json({
        message: "Boss request accepted",
        newBoss,
        newArchivedForm,
        deleted,
      });
  } catch (error) {
    console.error("Error accepting boss request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const declineBossRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    bossFirstName,
    bossLastName,
    position,
    companyId,
    userId,
    pendingId,
    status,
    requestedDate,
  } = req.body;

  try {
    const newArchivedForm = await prisma.archivedForms.create({
      data: {
        userId,
        bossFirstName,
        bossLastName,
        position,
        companyId,
        status,
        requestedDate,
      },
    });
    const deleted = await prisma.pendingBosses.delete({
      where: {
        pendingId,
      }
    });

    res
      .status(200)
      .json({ message: "Boss request declined", newArchivedForm, deleted });
  } catch (error) {
    console.error("Error declining boss request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArchivedForms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const archivedForms = await prisma.archivedForms.findMany({
      include: {
        User: true,
        Company: true,
      },
    });
    res.status(200).json(archivedForms);
  } catch (error) {
    console.error("Error fetching archived forms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPendingBossReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await prisma.pendingBossReviews.findMany({
      include: {
        Review: {
          include: {
            User: true,
            Boss: {
              include: {
                Company: true,
              },
            }
          }
        }
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const acceptPendingBossReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pendingId, reviewId } = req.body;
  
  try {
    const review = await prisma.bossReview.findUnique({
      where: {
        reviewId,
      },
    });

    const deleted = await prisma.pendingBossReviews.delete({
      where: {
        pendingId,
      },
    });

    const acceptedReview = await prisma.archivedBossReviews.create({
      data: {
        bossId: review?.bossId || "",
        userId: review?.userId ? review.userId : undefined,
        reviewText: review?.reviewText || "",
        status: "accepted",
        requestedDate: review?.timestamp ? review.timestamp.toISOString() : ""
      }
    });
    res.status(200).json({
      message: "Review accepted",
      review,
      deleted,
      acceptedReview
    });
  } catch (error) {
    console.error("Error accepting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const declinePendingBossReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pendingId, reviewId} = req.body;

  try {
    const deleted = await prisma.pendingBossReviews.delete({
      where: {
        pendingId,
      },
    });

    const deletedReview = await prisma.bossReview.delete({
      where: {
        reviewId,
      },
    });

    const archivedReview = await prisma.archivedBossReviews.create({
      data: {
        bossId: deletedReview.bossId,
        userId: deletedReview.userId,
        reviewText: deletedReview.reviewText,
        status: "declined",
        requestedDate: deletedReview.timestamp.toISOString()
      }
    });

    res.status(200).json({
      message: "Review declined",
      deleted,
      deletedReview,
      archivedReview
    });
  } catch (error) {
    console.error("Error declining review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getArchivedBossReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await prisma.archivedBossReviews.findMany({
      include: {
        User: true,
        Boss: {
          include: {
            Company: true,
          },
        }
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching archived reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getPendingCompanyReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pendingReviews = await prisma.pendingCompanyReviews.findMany({
      include: {
        Review: {
          include: {
            User: true,
            Company: true,
          },
        },
      },
    });
    res.status(200).json(pendingReviews);
  } catch (error) {
    console.error("Error fetching pending company reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const acceptPendingCompanyReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pendingId, reviewId } = req.body;

  try {
    const review = await prisma.companyReview.findUnique({
      where: {
        reviewId,
      },
    });

    const deleted = await prisma.pendingCompanyReviews.delete({
      where: {
        pendingId,
      },
    });

    const acceptedReview = await prisma.archivedCompanyReviews.create({
      data: {
        companyId: review?.companyId || "",
        userId: review?.userId ? review.userId : undefined,
        reviewText: review?.reviewText || "",
        status: "accepted",
        requestedDate: review?.timestamp ? review.timestamp.toISOString() : ""
      }
    });
    res.status(200).json({
      message: "Review accepted",
      review,
      deleted,
      acceptedReview
    });
  } catch (error) {
    console.error("Error accepting company review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const declinePendingCompanyReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pendingId, reviewId } = req.body;

  try {
    const deleted = await prisma.pendingCompanyReviews.delete({
      where: {
        pendingId,
      },
    });

    const deletedReview = await prisma.companyReview.delete({
      where: {
        reviewId,
      },
    });

    const archivedReview = await prisma.archivedCompanyReviews.create({
      data: {
        companyId: deletedReview.companyId,
        userId: deletedReview.userId,
        reviewText: deletedReview.reviewText,
        status: "declined",
        requestedDate: deletedReview.timestamp.toISOString()
      }
    });

    res.status(200).json({
      message: "Review declined",
      deleted,
      deletedReview,
      archivedReview
    });
  } catch (error) {
    console.error("Error declining company review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getArchivedCompanyReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await prisma.archivedCompanyReviews.findMany({
      include: {
        User: true,
        Company: true,
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching archived company reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
