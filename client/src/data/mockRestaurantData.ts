import type { Restaurant, RestaurantTable } from "@/types/restaurant.types";

export const mockRestaurants: Restaurant[] = [
  {
    id: "restaurant-1",
    name: "Demo Restaurant",
    slug: "demo-restaurant",
    description: "QR ordering demo restaurant",
    phone: "08 1234 5678",
    address: "Adelaide SA",
    isActive: true,
  },
];

export const mockRestaurantTables: RestaurantTable[] = [
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
];
