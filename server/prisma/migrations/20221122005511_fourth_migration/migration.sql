/*
  Warnings:

  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'DEFAULT';
