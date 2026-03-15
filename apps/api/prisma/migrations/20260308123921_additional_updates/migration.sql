/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "externalId" TEXT;

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "externalId" TEXT;

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_externalId_key" ON "Category"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_externalId_key" ON "Country"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_externalId_key" ON "Episode"("externalId");
