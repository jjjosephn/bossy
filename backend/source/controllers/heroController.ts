import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkCompanyExists = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { mapboxId, name, fullAddress } = req.body;

   try {
      const existingCompany = await prisma.company.findFirst({
         where: {
            mapboxId: mapboxId
         }
      })

      if (existingCompany) {
         res.status(200).json({ exists: true, company: existingCompany });
         return 
      }

      else {
         const newCompany = await prisma.company.create({
            data: {
               mapboxId: mapboxId,
               companyName: name,
               fullAddress: fullAddress,
            }
         })
         res.status(200).json({ message: "Company created", company: newCompany });
      }
   } catch (error) {
      console.error("Error checking company existence:", error);
      res.status(500).json({ message: "Internal server error" });
   }
}