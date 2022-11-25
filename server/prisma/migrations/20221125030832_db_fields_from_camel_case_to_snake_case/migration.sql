/*
  Warnings:

  - You are about to drop the column `actorId` on the `actor_image` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `actor_image` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `actors` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `banlist` table. All the data in the column will be lost.
  - You are about to drop the column `directorId` on the `director_image` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `director_image` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `directors` table. All the data in the column will be lost.
  - You are about to drop the column `actorId` on the `movie_actor` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `movie_actor` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `movie_category` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `movie_category` table. All the data in the column will be lost.
  - You are about to drop the column `directorId` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetDate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetHash` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `banlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[director_id]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actor_id` to the `actor_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `actor_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `actors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `banlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `director_id` to the `director_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `director_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `directors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actor_id` to the `movie_actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movie_id` to the `movie_actor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `movie_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movie_id` to the `movie_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `director_id` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "actor_image" DROP CONSTRAINT "actor_image_actorId_fkey";

-- DropForeignKey
ALTER TABLE "actor_image" DROP CONSTRAINT "actor_image_imageId_fkey";

-- DropForeignKey
ALTER TABLE "actors" DROP CONSTRAINT "actors_countryId_fkey";

-- DropForeignKey
ALTER TABLE "banlist" DROP CONSTRAINT "banlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "director_image" DROP CONSTRAINT "director_image_directorId_fkey";

-- DropForeignKey
ALTER TABLE "director_image" DROP CONSTRAINT "director_image_imageId_fkey";

-- DropForeignKey
ALTER TABLE "directors" DROP CONSTRAINT "directors_countryId_fkey";

-- DropForeignKey
ALTER TABLE "movie_actor" DROP CONSTRAINT "movie_actor_actorId_fkey";

-- DropForeignKey
ALTER TABLE "movie_actor" DROP CONSTRAINT "movie_actor_movieId_fkey";

-- DropForeignKey
ALTER TABLE "movie_category" DROP CONSTRAINT "movie_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "movie_category" DROP CONSTRAINT "movie_category_movieId_fkey";

-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_directorId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_countryId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_imageId_fkey";

-- DropIndex
DROP INDEX "banlist_userId_key";

-- DropIndex
DROP INDEX "movies_directorId_key";

-- DropIndex
DROP INDEX "users_imageId_key";

-- AlterTable
ALTER TABLE "actor_image" DROP COLUMN "actorId",
DROP COLUMN "imageId",
ADD COLUMN     "actor_id" INTEGER NOT NULL,
ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "actors" DROP COLUMN "countryId",
ADD COLUMN     "country_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "banlist" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "director_image" DROP COLUMN "directorId",
DROP COLUMN "imageId",
ADD COLUMN     "director_id" INTEGER NOT NULL,
ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "directors" DROP COLUMN "countryId",
ADD COLUMN     "country_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "movie_actor" DROP COLUMN "actorId",
DROP COLUMN "movieId",
ADD COLUMN     "actor_id" INTEGER NOT NULL,
ADD COLUMN     "movie_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "movie_category" DROP COLUMN "categoryId",
DROP COLUMN "movieId",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "movie_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "directorId",
DROP COLUMN "releaseDate",
ADD COLUMN     "director_id" INTEGER NOT NULL,
ADD COLUMN     "release_date" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "countryId",
DROP COLUMN "imageId",
DROP COLUMN "passwordResetDate",
DROP COLUMN "passwordResetHash",
ADD COLUMN     "country_id" INTEGER NOT NULL,
ADD COLUMN     "image_id" INTEGER,
ADD COLUMN     "password_reset_date" TIMESTAMP(3),
ADD COLUMN     "password_reset_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "banlist_user_id_key" ON "banlist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "movies_director_id_key" ON "movies"("director_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_image_id_key" ON "users"("image_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banlist" ADD CONSTRAINT "banlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "directors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_category" ADD CONSTRAINT "movie_category_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_category" ADD CONSTRAINT "movie_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "directors" ADD CONSTRAINT "directors_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "director_image" ADD CONSTRAINT "director_image_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "directors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "director_image" ADD CONSTRAINT "director_image_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actors" ADD CONSTRAINT "actors_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
