/*
  Warnings:

  - You are about to drop the column `spotifyId` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_spotifyId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "spotifyId",
ADD COLUMN     "password" TEXT NOT NULL;
