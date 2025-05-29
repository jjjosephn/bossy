-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fieldOfWork" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Company" (
    "companyId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "mapboxId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("companyId")
);

-- CreateTable
CREATE TABLE "CompanyReview" (
    "reviewId" TEXT NOT NULL,
    "reviewText" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyReview_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "PendingCompanyReviews" (
    "pendingId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "PendingCompanyReviews_pkey" PRIMARY KEY ("pendingId")
);

-- CreateTable
CREATE TABLE "ArchivedCompanyReviews" (
    "archiveId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "reviewText" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestedDate" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivedCompanyReviews_pkey" PRIMARY KEY ("archiveId")
);

-- CreateTable
CREATE TABLE "Boss" (
    "bossId" TEXT NOT NULL,
    "bossFirstName" TEXT NOT NULL,
    "bossLastName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boss_pkey" PRIMARY KEY ("bossId")
);

-- CreateTable
CREATE TABLE "PendingBosses" (
    "pendingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bossFirstName" TEXT NOT NULL,
    "bossLastName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingBosses_pkey" PRIMARY KEY ("pendingId")
);

-- CreateTable
CREATE TABLE "ArchivedForms" (
    "archivedId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bossFirstName" TEXT NOT NULL,
    "bossLastName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestedDate" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivedForms_pkey" PRIMARY KEY ("archivedId")
);

-- CreateTable
CREATE TABLE "BossReview" (
    "reviewId" TEXT NOT NULL,
    "reviewText" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "term" TEXT NOT NULL,
    "userId" TEXT,
    "bossId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BossReview_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "PendingBossReviews" (
    "pendingId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "PendingBossReviews_pkey" PRIMARY KEY ("pendingId")
);

-- CreateTable
CREATE TABLE "ArchivedBossReviews" (
    "archiveId" TEXT NOT NULL,
    "bossId" TEXT NOT NULL,
    "userId" TEXT,
    "reviewText" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestedDate" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchivedBossReviews_pkey" PRIMARY KEY ("archiveId")
);

-- AddForeignKey
ALTER TABLE "CompanyReview" ADD CONSTRAINT "CompanyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyReview" ADD CONSTRAINT "CompanyReview_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingCompanyReviews" ADD CONSTRAINT "PendingCompanyReviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "CompanyReview"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedCompanyReviews" ADD CONSTRAINT "ArchivedCompanyReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedCompanyReviews" ADD CONSTRAINT "ArchivedCompanyReviews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boss" ADD CONSTRAINT "Boss_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBosses" ADD CONSTRAINT "PendingBosses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBosses" ADD CONSTRAINT "PendingBosses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedForms" ADD CONSTRAINT "ArchivedForms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedForms" ADD CONSTRAINT "ArchivedForms_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossReview" ADD CONSTRAINT "BossReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossReview" ADD CONSTRAINT "BossReview_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("bossId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBossReviews" ADD CONSTRAINT "PendingBossReviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "BossReview"("reviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedBossReviews" ADD CONSTRAINT "ArchivedBossReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedBossReviews" ADD CONSTRAINT "ArchivedBossReviews_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("bossId") ON DELETE RESTRICT ON UPDATE CASCADE;
