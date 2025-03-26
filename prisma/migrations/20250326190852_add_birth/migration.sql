/*
  Warnings:

  - You are about to alter the column `nome` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(125)`.
  - You are about to alter the column `email` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(125)`.
  - You are about to alter the column `senha` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(125)`.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "birthAt" TIMESTAMP,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(125),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(125),
ALTER COLUMN "senha" SET DATA TYPE VARCHAR(125);
