"use client";

import { useSearchParams } from "next/navigation";

import {
  mockRestaurants,
  mockRestaurantTables,
} from "@/data/mockRestaurantData";

const QREntry = () => {
  const searchParams = useSearchParams();

  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  // Find restaurant from mock data
  const restaurant = mockRestaurants.find((item) => item.id === restaurantId);

  // Find table from mock data
  const table = mockRestaurantTables.find((item) => item.id === tableId);

  // Missing query parameters
  if (!restaurantId || !tableId) {
    return (
      <div>
        <h1>Invalid QR Code</h1>
        <p>Restaurant or table information is missing.</p>
      </div>
    );
  }

  // Restaurant does not exist
  if (!restaurant) {
    return (
      <div>
        <h1>Restaurant Not Found</h1>
        <p>This restaurant is not available.</p>
      </div>
    );
  }

  // Table does not exist
  if (!table) {
    return (
      <div>
        <h1>Table Not Found</h1>
        <p>This table does not exist.</p>
      </div>
    );
  }

  // Prevent a table from another restaurant being used
  if (table.restaurantId !== restaurant.id) {
    return (
      <div>
        <h1>Invalid Table</h1>
        <p>This table does not belong to this restaurant.</p>
      </div>
    );
  }

  // Restaurant inactive
  if (!restaurant.isActive) {
    return (
      <div>
        <h1>Restaurant Unavailable</h1>
        <p>This restaurant is currently unavailable.</p>
      </div>
    );
  }

  // Table inactive
  if (!table.isActive || table.status === "INACTIVE") {
    return (
      <div>
        <h1>Table Unavailable</h1>
        <p>This table is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{restaurant.name}</h1>

      <p>{restaurant.description}</p>

      <h2>{table.name}</h2>

      <p>Table Number: {table.tableNumber}</p>

      {table.capacity && <p>Capacity: {table.capacity}</p>}

      <p>QR entry validated successfully.</p>
    </div>
  );
};

export default QREntry;
