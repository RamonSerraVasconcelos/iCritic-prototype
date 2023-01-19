-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_reset_date" TIMESTAMP(3),
ADD COLUMN     "email_reset_hash" TEXT,
ADD COLUMN     "new_email_reset" TEXT;
