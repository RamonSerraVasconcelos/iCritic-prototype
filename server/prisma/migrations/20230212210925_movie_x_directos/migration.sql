/*
  Warnings:

  - You are about to drop the column `director_id` on the `movies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_director_id_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "director_id",
ADD COLUMN     "directorId" INTEGER;

-- CreateTable
CREATE TABLE "movie_director" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "director_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_director_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movie_director" ADD CONSTRAINT "movie_director_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_director" ADD CONSTRAINT "movie_director_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "directors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
