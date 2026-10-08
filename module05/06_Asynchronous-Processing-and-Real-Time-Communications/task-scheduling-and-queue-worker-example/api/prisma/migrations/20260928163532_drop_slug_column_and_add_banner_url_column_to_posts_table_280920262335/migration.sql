/*
  Warnings:

  - You are about to drop the column `slug` on the `posts` table. All the data in the column will be lost.
  - Added the required column `banner_url` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "posts_slug_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "slug",
ADD COLUMN     "banner_url" TEXT NOT NULL;
