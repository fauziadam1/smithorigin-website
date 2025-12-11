-- AlterTable
ALTER TABLE "forum_replies" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "forum_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
