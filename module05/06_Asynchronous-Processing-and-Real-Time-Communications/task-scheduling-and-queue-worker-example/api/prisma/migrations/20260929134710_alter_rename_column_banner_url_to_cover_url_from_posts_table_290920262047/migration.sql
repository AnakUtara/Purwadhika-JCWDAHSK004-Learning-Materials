/*
  Warnings:

  - You are about to drop the column `banner_url` on the `posts` table. All the data in the column will be lost.
  - Added the required column `cover_url` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "banner_url",
ADD COLUMN     "cover_url" TEXT NOT NULL;
