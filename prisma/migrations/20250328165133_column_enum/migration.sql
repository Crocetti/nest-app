-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
