/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bookmarks" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_link_key" ON "bookmarks"("link");
