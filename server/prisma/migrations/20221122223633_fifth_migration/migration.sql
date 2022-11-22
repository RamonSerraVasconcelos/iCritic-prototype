/*
  Warnings:

  - You are about to drop the column `passwordReset` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePic` on the `users` table. All the data in the column will be lost.
  - The `countryId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `passwordResetDate` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "actors" ADD COLUMN     "countryId" INTEGER;

-- AlterTable
ALTER TABLE "directors" ADD COLUMN     "countryId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordReset",
DROP COLUMN "profilePic",
ADD COLUMN     "passwordResetHash" TEXT,
DROP COLUMN "countryId",
ADD COLUMN     "countryId" INTEGER,
DROP COLUMN "passwordResetDate",
ADD COLUMN     "passwordResetDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directors" ADD CONSTRAINT "directors_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actors" ADD CONSTRAINT "actors_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
