/*
  Warnings:

  - You are about to drop the column `artist` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "artist",
ADD COLUMN     "artists" TEXT[];
