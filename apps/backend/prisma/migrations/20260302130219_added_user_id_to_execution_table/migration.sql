/*
  Warnings:

  - Added the required column `userId` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "userId" TEXT NOT NULL;
