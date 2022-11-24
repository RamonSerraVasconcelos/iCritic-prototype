/*
  Warnings:

  - The primary key for the `images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `images` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `imageId` on the `actor_image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `imageId` on the `director_image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `path` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "actor_image" DROP CONSTRAINT "actor_image_imageId_fkey";

-- DropForeignKey
ALTER TABLE "director_image" DROP CONSTRAINT "director_image_imageId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_imageId_fkey";

-- AlterTable
ALTER TABLE "actor_image" DROP COLUMN "imageId",
ADD COLUMN     "imageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "director_image" DROP COLUMN "imageId",
ADD COLUMN     "imageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "images" DROP CONSTRAINT "images_pkey",
ADD COLUMN     "path" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "imageId",
ADD COLUMN     "imageId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_imageId_key" ON "users"("imageId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "director_image" ADD CONSTRAINT "director_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
