/*
  Warnings:

  - You are about to drop the column `language` on the `movies` table. All the data in the column will be lost.
  - Added the required column `language_id` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "movies_director_id_key";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "language",
ADD COLUMN     "language_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
