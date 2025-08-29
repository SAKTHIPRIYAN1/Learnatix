/*
  Warnings:

  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE INDEX "Users_clerkId_idx" ON "public"."Users"("clerkId");
