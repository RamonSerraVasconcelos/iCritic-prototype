/*
  Warnings:

  - You are about to drop the `actor_category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "actor_category" DROP CONSTRAINT "actor_category_actorId_fkey";

-- DropForeignKey
ALTER TABLE "actor_category" DROP CONSTRAINT "actor_category_movieId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imageId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "actor_category";

-- CreateTable
CREATE TABLE "movie_actor" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_actor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_imageId_key" ON "users"("imageId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
