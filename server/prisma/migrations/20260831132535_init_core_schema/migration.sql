-- CreateEnum
CREATE TYPE "OptionSelectionType" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateTable
CREATE TABLE "OptionGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "selectionType" "OptionSelectionType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "minSelection" INTEGER NOT NULL DEFAULT 0,
    "maxSelection" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OptionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "additionalPrice" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "optionGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuItemToOptionGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MenuItemToOptionGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "OptionGroup_restaurantId_idx" ON "OptionGroup"("restaurantId");

-- CreateIndex
CREATE INDEX "OptionGroup_restaurantId_sortOrder_idx" ON "OptionGroup"("restaurantId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "OptionGroup_restaurantId_name_key" ON "OptionGroup"("restaurantId", "name");

-- CreateIndex
CREATE INDEX "OptionItem_optionGroupId_idx" ON "OptionItem"("optionGroupId");

-- CreateIndex
CREATE INDEX "OptionItem_optionGroupId_sortOrder_idx" ON "OptionItem"("optionGroupId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "OptionItem_optionGroupId_name_key" ON "OptionItem"("optionGroupId", "name");

-- CreateIndex
CREATE INDEX "_MenuItemToOptionGroup_B_index" ON "_MenuItemToOptionGroup"("B");

-- AddForeignKey
ALTER TABLE "OptionGroup" ADD CONSTRAINT "OptionGroup_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "OptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToOptionGroup" ADD CONSTRAINT "_MenuItemToOptionGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToOptionGroup" ADD CONSTRAINT "_MenuItemToOptionGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "OptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
