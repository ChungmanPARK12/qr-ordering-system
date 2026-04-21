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

  await prisma.restaurant.create({
    data: {
      id: "rest_demo_1",
      name: "Demo Restaurant",
      slug: "demo-restaurant",
      description: "Test",
      address: "Adelaide",
      phone: "0411000000",
      isActive: true,
    },
  });

  await prisma.adminUser.create({
    data: {
      id: "admin_1",
      email: "admin@demo.com",
      passwordHash: "test1234",
      name: "Main Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      restaurantId: "rest_demo_1",
    },
  });

  await prisma.restaurantTable.createMany({
    data: [
      {
        id: "table_1",
        name: "T1",
        tableNumber: 1,
        capacity: 4,
        isActive: true,
        status: "ACTIVE",
        restaurantId: "rest_demo_1",
      },
      {
        id: "table_2",
        name: "T2",
        tableNumber: 2,
        capacity: 4,
        isActive: true,
        status: "ACTIVE",
        restaurantId: "rest_demo_1",
      },
      {
        id: "table_3",
        name: "T3",
        tableNumber: 3,
        capacity: 4,
        isActive: true,
        status: "ACTIVE",
        restaurantId: "rest_demo_1",
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      {
        id: "cat_drinks_1",
        name: "Drinks",
        description: "Beverage menu",
        isVisible: true,
        sortOrder: 0,
        restaurantId: "rest_demo_1",
      },
      {
        id: "cat_main_1",
        name: "Main",
        description: "Main dishes",
        isVisible: true,
        sortOrder: 1,
        restaurantId: "rest_demo_1",
      },
      {
        id: "cat_dessert_1",
        name: "Dessert",
        description: "Dessert menu",
        isVisible: true,
        sortOrder: 2,
        restaurantId: "rest_demo_1",
      },
    ],
  });

  await prisma.menuItem.createMany({
    data: [
      {
        id: "menu_coke_1",
        categoryId: "cat_drinks_1",
        restaurantId: "rest_demo_1",
        name: "Coke",
        description: "Classic Coca-Cola",
        price: 450,
        imageUrl: null,
        isSoldOut: false,
        isVisible: true,
        sortOrder: 0,
      },
      {
        id: "menu_sprite_1",
        categoryId: "cat_drinks_1",
        restaurantId: "rest_demo_1",
        name: "Sprite",
        description: "Lemon-lime soda",
        price: 450,
        imageUrl: null,
        isSoldOut: false,
        isVisible: true,
        sortOrder: 1,
      },
      {
        id: "menu_pizza_1",
        categoryId: "cat_main_1",
        restaurantId: "rest_demo_1",
        name: "Pizza",
        description: "Cheese pizza",
        price: 1850,
        imageUrl: null,
        isSoldOut: false,
        isVisible: true,
        sortOrder: 0,
      },
      {
        id: "menu_cake_1",
        categoryId: "cat_dessert_1",
        restaurantId: "rest_demo_1",
        name: "Cake",
        description: "Chocolate cake",
        price: 700,
        imageUrl: null,
        isSoldOut: false,
        isVisible: true,
        sortOrder: 0,
      },
    ],
  });

  console.log("🌱 Seeding finished successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("🌱 Seeding finished.");
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
