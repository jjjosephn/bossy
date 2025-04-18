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
