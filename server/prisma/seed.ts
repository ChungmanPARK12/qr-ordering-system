import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Start seeding...");

  // --------------------------------
  // Cleanup existing demo data
  // --------------------------------

  await prisma.restaurant.deleteMany({
    where: {
      slug: "demo-restaurant",
    },
  });

  // --------------------------------
  // Restaurant
  // --------------------------------

  await prisma.restaurant.create({
    data: {
      id: "restaurant-1",
      name: "Demo Restaurant",
      slug: "demo-restaurant",
      description: "QR ordering demo restaurant",
      phone: "08 1234 5678",
      address: "Adelaide SA",
      isActive: true,
    },
  });

  // --------------------------------
  // Tables
  // --------------------------------

  await prisma.restaurantTable.createMany({
    data: [
      {
        id: "table-1",
        name: "Table 1",
        qrCode: "qr-table-1",
        tableNumber: 1,
        capacity: 2,
        status: "ACTIVE",
        isActive: true,
        restaurantId: "restaurant-1",
      },
      {
        id: "table-2",
        name: "Table 2",
        qrCode: "qr-table-2",
        tableNumber: 2,
        capacity: 4,
        status: "ACTIVE",
        isActive: true,
        restaurantId: "restaurant-1",
      },
      {
        id: "table-3",
        name: "Table 3",
        qrCode: "qr-table-3",
        tableNumber: 3,
        capacity: 4,
        status: "INACTIVE",
        isActive: false,
        restaurantId: "restaurant-1",
      },
    ],
  });

  // --------------------------------
  // Categories
  // --------------------------------

  await prisma.category.createMany({
    data: [
      {
        id: "category-1",
        name: "Main",
        description: "Main dishes",
        sortOrder: 1,
        isVisible: true,
        restaurantId: "restaurant-1",
      },
      {
        id: "category-2",
        name: "Drinks",
        description: "Cold and hot drinks",
        sortOrder: 2,
        isVisible: true,
        restaurantId: "restaurant-1",
      },
      {
        id: "category-3",
        name: "Desserts",
        description: "Dessert menu",
        sortOrder: 3,
        isVisible: true,
        restaurantId: "restaurant-1",
      },
    ],
  });

  // --------------------------------
  // Menu Items
  // --------------------------------

  await prisma.menuItem.createMany({
    data: [
      {
        id: "menu-1",
        name: "Cheeseburger",
        description: "Beef patty with cheese",
        price: 1590,
        imageUrl: null,
        sortOrder: 1,
        isVisible: true,
        isSoldOut: false,
        restaurantId: "restaurant-1",
        categoryId: "category-1",
      },
      {
        id: "menu-2",
        name: "Chicken Burger",
        description: "Grilled chicken burger",
        price: 1490,
        imageUrl: null,
        sortOrder: 2,
        isVisible: true,
        isSoldOut: true,
        restaurantId: "restaurant-1",
        categoryId: "category-1",
      },
      {
        id: "menu-3",
        name: "Coke",
        description: "Coca-Cola",
        price: 450,
        imageUrl: null,
        sortOrder: 1,
        isVisible: true,
        isSoldOut: false,
        restaurantId: "restaurant-1",
        categoryId: "category-2",
      },
      {
        id: "menu-4",
        name: "Coffee",
        description: "Freshly brewed coffee",
        price: 500,
        imageUrl: null,
        sortOrder: 2,
        isVisible: true,
        isSoldOut: false,
        restaurantId: "restaurant-1",
        categoryId: "category-2",
      },
      {
        id: "menu-5",
        name: "Cheesecake",
        description: "Classic cheesecake",
        price: 750,
        imageUrl: null,
        sortOrder: 1,
        isVisible: true,
        isSoldOut: false,
        restaurantId: "restaurant-1",
        categoryId: "category-3",
      },
    ],
  });

  // --------------------------------
  // Option Groups
  // --------------------------------

  await prisma.optionGroup.create({
    data: {
      id: "option-group-1",
      name: "Size",
      selectionType: "SINGLE",
      isRequired: true,
      minSelection: 1,
      maxSelection: 1,
      sortOrder: 1,
      restaurantId: "restaurant-1",

      menuItems: {
        connect: [{ id: "menu-1" }, { id: "menu-2" }, { id: "menu-4" }],
      },
    },
  });

  await prisma.optionGroup.create({
    data: {
      id: "option-group-2",
      name: "Extras",
      selectionType: "MULTIPLE",
      isRequired: false,
      minSelection: 0,
      maxSelection: 3,
      sortOrder: 2,
      restaurantId: "restaurant-1",

      menuItems: {
        connect: [{ id: "menu-1" }, { id: "menu-2" }],
      },
    },
  });

  await prisma.optionGroup.create({
    data: {
      id: "option-group-3",
      name: "Milk",
      selectionType: "SINGLE",
      isRequired: false,
      minSelection: 0,
      maxSelection: 1,
      sortOrder: 2,
      restaurantId: "restaurant-1",

      menuItems: {
        connect: [{ id: "menu-4" }],
      },
    },
  });

  // --------------------------------
  // Option Items
  // --------------------------------

  await prisma.optionItem.createMany({
    data: [
      {
        id: "option-item-1",
        name: "Regular",
        additionalPrice: 0,
        sortOrder: 1,
        optionGroupId: "option-group-1",
      },
      {
        id: "option-item-2",
        name: "Large",
        additionalPrice: 300,
        sortOrder: 2,
        optionGroupId: "option-group-1",
      },

      {
        id: "option-item-3",
        name: "Extra Cheese",
        additionalPrice: 100,
        sortOrder: 1,
        optionGroupId: "option-group-2",
      },
      {
        id: "option-item-4",
        name: "Bacon",
        additionalPrice: 200,
        sortOrder: 2,
        optionGroupId: "option-group-2",
      },
      {
        id: "option-item-5",
        name: "Extra Patty",
        additionalPrice: 400,
        sortOrder: 3,
        optionGroupId: "option-group-2",
      },

      {
        id: "option-item-6",
        name: "Full Cream",
        additionalPrice: 0,
        sortOrder: 1,
        optionGroupId: "option-group-3",
      },
      {
        id: "option-item-7",
        name: "Soy",
        additionalPrice: 100,
        sortOrder: 2,
        optionGroupId: "option-group-3",
      },
      {
        id: "option-item-8",
        name: "Oat",
        additionalPrice: 100,
        sortOrder: 3,
        optionGroupId: "option-group-3",
      },
    ],
  });

  console.log("🌱 Seeding finished successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:", error);

    await prisma.$disconnect();
    await pool.end();

    process.exit(1);
  });
