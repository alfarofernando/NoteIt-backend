/*
  Warnings:

  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Tag` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Note` MODIFY `title` VARCHAR(200) NOT NULL,
    MODIFY `content` VARCHAR(5000) NOT NULL;

-- AlterTable
ALTER TABLE `Tag` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(100) NOT NULL;
