/*
  Warnings:

  - The `role` column on the `usuarios` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "role",
ADD COLUMN     "role" VARCHAR(15) NOT NULL DEFAULT 'user';

-- DropEnum
DROP TYPE "Role";
