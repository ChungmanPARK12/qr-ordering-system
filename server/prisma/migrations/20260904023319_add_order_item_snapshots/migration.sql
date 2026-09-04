/*
  Warnings:

  - Added the required column `basePriceSnapshot` to the `CustomerOrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedOptions` to the `CustomerOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerOrderItem" ADD COLUMN     "basePriceSnapshot" INTEGER NOT NULL,
ADD COLUMN     "selectedOptions" JSONB NOT NULL;
