-- CreateTable
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NULL,
    `createTime` DATETIME(3) NOT NULL,
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Setting_id_key`(`id`),
    UNIQUE INDEX `Setting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `sign` VARCHAR(191) NOT NULL,
    `suffix` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `storageType` ENUM('local') NOT NULL,
    `createTime` DATETIME(3) NOT NULL,
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Image_id_key`(`id`),
    UNIQUE INDEX `Image_sign_key`(`sign`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `abstract` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `slug` VARCHAR(191) NULL,
    `keywords` TEXT NULL,
    `status` ENUM('draft', 'published') NOT NULL,
    `createTime` DATETIME(3) NOT NULL,
    `updateTime` DATETIME(3) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NULL,

    UNIQUE INDEX `Post_id_key`(`id`),
    UNIQUE INDEX `Post_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `status` ENUM('draft', 'published') NOT NULL,
    `createTime` DATETIME(3) NOT NULL,
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_id_key`(`id`),
    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SideNotice` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `desc` TEXT NOT NULL,
    `imageId` VARCHAR(191) NULL,
    `order` INTEGER NULL,
    `status` ENUM('draft', 'published') NOT NULL,
    `orientation` ENUM('vertical', 'horizontal') NULL,
    `createTime` DATETIME(3) NOT NULL,
    `updateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SideNotice_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `A` (
    `id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `A_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SideNotice` ADD CONSTRAINT `SideNotice_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
