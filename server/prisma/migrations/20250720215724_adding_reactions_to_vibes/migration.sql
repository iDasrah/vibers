-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "vibeId" TEXT;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_vibeId_fkey" FOREIGN KEY ("vibeId") REFERENCES "Vibe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
