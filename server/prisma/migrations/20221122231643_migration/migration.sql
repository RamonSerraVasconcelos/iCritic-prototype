-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_imageId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "imageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
