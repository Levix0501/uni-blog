/*
  Warnings:

  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Category_id_key";

-- DropIndex
DROP INDEX "Image_id_key";

-- DropIndex
DROP INDEX "Post_id_key";

-- DropIndex
DROP INDEX "SideNotice_id_key";

-- DropTable
DROP TABLE "Setting";

-- CreateTable
CREATE TABLE "DocumentModel" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "parentUuid" TEXT,
    "prevUuid" TEXT,
    "siblingUuid" TEXT,
    "childUuid" TEXT,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "abstract" TEXT NOT NULL DEFAULT '',
    "slug" TEXT,
    "keywords" TEXT,
    "coverImageId" TEXT,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentModel_uuid_key" ON "DocumentModel"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentModel_slug_key" ON "DocumentModel"("slug");

-- AddForeignKey
ALTER TABLE "DocumentModel" ADD CONSTRAINT "DocumentModel_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
