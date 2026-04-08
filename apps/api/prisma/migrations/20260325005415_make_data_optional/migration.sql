/*
  Warnings:

  - You are about to drop the column `buttons` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `elements` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `tailwind` on the `Component` table. All the data in the column will be lost.
  - The `styles` column on the `Component` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[url]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "buttons",
DROP COLUMN "colors",
DROP COLUMN "elements",
ADD COLUMN     "data" JSONB NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'completed';

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "tailwind",
ADD COLUMN     "analysisId" TEXT,
ADD COLUMN     "assetCode" TEXT,
ADD COLUMN     "assetUrl" TEXT,
ADD COLUMN     "html" TEXT,
DROP COLUMN "styles",
ADD COLUMN     "styles" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_url_key" ON "Analysis"("url");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
