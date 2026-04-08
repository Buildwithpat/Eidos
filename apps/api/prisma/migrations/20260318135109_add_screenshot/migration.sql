/*
  Warnings:

  - You are about to drop the column `fonts` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `headings` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `Analysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "fonts",
DROP COLUMN "headings",
DROP COLUMN "primaryColor",
ADD COLUMN     "screenshot" TEXT,
ALTER COLUMN "status" DROP DEFAULT;
