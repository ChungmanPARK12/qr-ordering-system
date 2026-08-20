"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  mockRestaurants,
  mockRestaurantTables,
} from "@/data/mockRestaurantData";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

const QREntry = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { session, setSession } = useOrderSession();

  const restaurantId = searchParams.get("restaurantId");

  const tableId = searchParams.get("tableId");

  // -----------------------------
  // Find restaurant from mock data
  // -----------------------------
  const restaurant = mockRestaurants.find((item) => item.id === restaurantId);

  // -----------------------------
  // Find table from mock data
  // -----------------------------
  const table = mockRestaurantTables.find((item) => item.id === tableId);

  // -----------------------------
  // Store validated order session
  // -----------------------------
  useEffect(() => {
    if (!restaurant || !table) return;

    if (!restaurant.isActive) return;

    if (!table.isActive || table.status === "INACTIVE") {
      return;
    }

    if (table.restaurantId !== restaurant.id) {
      return;
    }

    setSession({
      restaurant,
      table,
    });
  }, [restaurant, table, setSession]);

  // -----------------------------
  // Missing query parameters
  // -----------------------------
  if (!restaurantId || !tableId) {
    return (
      <div>
        <h1>Invalid QR Code</h1>

        <p>Restaurant or table information is missing.</p>
      </div>
    );
  }

  // -----------------------------
  // Restaurant does not exist
  // -----------------------------
  if (!restaurant) {
    return (
      <div>
        <h1>Restaurant Not Found</h1>

        <p>This restaurant is not available.</p>
      </div>
    );
  }

  // -----------------------------
  // Table does not exist
  // -----------------------------
  if (!table) {
    return (
      <div>
        <h1>Table Not Found</h1>

        <p>This table does not exist.</p>
      </div>
    );
  }

  // -----------------------------
  // Table belongs to another restaurant
  // -----------------------------
  if (table.restaurantId !== restaurant.id) {
    return (
      <div>
        <h1>Invalid Table</h1>

        <p>This table does not belong to this restaurant.</p>
      </div>
    );
  }

  // -----------------------------
  // Restaurant inactive
  // -----------------------------
  if (!restaurant.isActive) {
    return (
      <div>
        <h1>Restaurant Unavailable</h1>

        <p>This restaurant is currently unavailable.</p>
      </div>
    );
  }

  // -----------------------------
  // Table inactive
  // -----------------------------
  if (!table.isActive || table.status === "INACTIVE") {
    return (
      <div>
        <h1>Table Unavailable</h1>

        <p>This table is currently unavailable.</p>
      </div>
    );
  }

  // -----------------------------
  // Valid QR entry
  // -----------------------------
  return (
    <div>
      <h1>{restaurant.name}</h1>

      <p>{restaurant.description}</p>

      <h2>{table.name}</h2>

      <p>Table Number: {table.tableNumber}</p>

      {table.capacity && <p>Capacity: {table.capacity}</p>}

      <p>QR entry validated successfully.</p>

      {/* Temporary Day 4 session check */}
      {session && (
        <div>
          <h3>Order Session</h3>

          <p>Restaurant: {session.restaurant.name}</p>

          <p>Table: {session.table.name}</p>
        </div>
      )}

      <button onClick={() => router.push("/order/menu")}>Start Order</button>
    </div>
  );
};

export default QREntry;
