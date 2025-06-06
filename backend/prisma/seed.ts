import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
const modelNames = orderedFileNames.map((fileName) => {
   const modelName = path.basename(fileName, path.extname(fileName));
   return modelName.charAt(0).toUpperCase() + modelName.slice(1);
});

// Delete related data in reverse order to avoid foreign key violations
for (const modelName of modelNames.reverse()) {
   const model: any = prisma[modelName as keyof typeof prisma];
   if (model) {
      await model.deleteMany({});
   } else {
      console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`);
   }
}
}

async function main() {
const dataDirectory = path.join(__dirname, "seedData");

const orderedFileNames = [
   "user.json",
   "company.json",
   "boss.json",
   "bossReview.json",
   "companyReview.json",
   "pendingBosses.json",
   "archivedForms.json",
   "archivedBossReviews.json",
   "pendingBossReviews.json",
   "pendingCompanyReviews.json",
   "archivedCompanyReviews.json",
   "feedback.json"
];

await deleteAllData(orderedFileNames);

for (const fileName of orderedFileNames) {
   const filePath = path.join(dataDirectory, fileName);
   const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
   const modelName = path.basename(fileName, path.extname(fileName));
   const model: any = prisma[modelName as keyof typeof prisma];

   if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
   }

   for (const data of jsonData) {
      await model.create({
      data,
      });
   }
   console.log("seeded " + fileName)
}
}

main()
.catch((e) => {
   console.error(e);
})
.finally(async () => {
   await prisma.$disconnect();
});