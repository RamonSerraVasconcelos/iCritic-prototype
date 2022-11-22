/*
  Warnings:

  - You are about to drop the `BanList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BanList" DROP CONSTRAINT "BanList_userId_fkey";

-- DropTable
DROP TABLE "BanList";

-- CreateTable
CREATE TABLE "banlist" (
    "id" SERIAL NOT NULL,
    "motive" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banlist_userId_key" ON "banlist"("userId");

-- AddForeignKey
ALTER TABLE "banlist" ADD CONSTRAINT "banlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
