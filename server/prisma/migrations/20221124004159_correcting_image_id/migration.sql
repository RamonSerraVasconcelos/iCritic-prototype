/*
  Warnings:

  - The primary key for the `images` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "actor_image" DROP CONSTRAINT "actor_image_imageId_fkey";

-- DropForeignKey
ALTER TABLE "director_image" DROP CONSTRAINT "director_image_imageId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_imageId_fkey";

-- AlterTable
ALTER TABLE "actor_image" ALTER COLUMN "imageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "director_image" ALTER COLUMN "imageId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "images" DROP CONSTRAINT "images_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "images_id_seq";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "imageId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "director_image" ADD CONSTRAINT "director_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
