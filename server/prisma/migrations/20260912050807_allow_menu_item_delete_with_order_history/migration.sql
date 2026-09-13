-- DropForeignKey
ALTER TABLE "CustomerOrderItem" DROP CONSTRAINT "CustomerOrderItem_menuItemId_fkey";

-- AddForeignKey
ALTER TABLE "CustomerOrderItem" ADD CONSTRAINT "CustomerOrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
