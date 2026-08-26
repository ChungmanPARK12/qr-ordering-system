"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";

import {
  mockRestaurants,
  mockRestaurantTables,
} from "@/data/mockRestaurantData";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import styles from "./QREntry.module.css";

const QREntry = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setSession } = useOrderSession();

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
  // Shared status / error layout
  // -----------------------------
  const renderStatusPage = (title: string, message: string) => {
    return (
      <main className={styles.statusPage}>
        <Card className={styles.statusCard}>
          <div className={styles.statusIcon}>!</div>

          <h1 className={styles.statusTitle}>{title}</h1>

          <p className={styles.statusMessage}>{message}</p>

          <p className={styles.statusHelper}>
            Please check the QR code or ask a staff member for assistance.
          </p>
        </Card>
      </main>
    );
  };

  // -----------------------------
  // Missing query parameters
  // -----------------------------
  if (!restaurantId || !tableId) {
    return renderStatusPage(
      "Invalid QR Code",
      "Restaurant or table information is missing.",
    );
  }

  // -----------------------------
  // Restaurant does not exist
  // -----------------------------
  if (!restaurant) {
    return renderStatusPage(
      "Restaurant Not Found",
      "This restaurant could not be found.",
    );
  }

  // -----------------------------
  // Table does not exist
  // -----------------------------
  if (!table) {
    return renderStatusPage(
      "Table Not Found",
      "This table could not be found.",
    );
  }

  // -----------------------------
  // Table belongs to another restaurant
  // -----------------------------
  if (table.restaurantId !== restaurant.id) {
    return renderStatusPage(
      "Invalid Table",
      "This table does not belong to this restaurant.",
    );
  }

  // -----------------------------
  // Restaurant inactive
  // -----------------------------
  if (!restaurant.isActive) {
    return renderStatusPage(
      "Restaurant Unavailable",
      "This restaurant is currently unavailable for ordering.",
    );
  }

  // -----------------------------
  // Table inactive
  // -----------------------------
  if (!table.isActive || table.status === "INACTIVE") {
    return renderStatusPage(
      "Table Unavailable",
      "This table is currently unavailable for ordering.",
    );
  }

  // -----------------------------
  // Valid QR entry
  // -----------------------------
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* -----------------------------
            Restaurant branding
        ------------------------------ */}
        <section className={styles.branding}>
          <div className={styles.logoPlaceholder}>
            {restaurant.name.charAt(0).toUpperCase()}
          </div>

          <h1 className={styles.restaurantName}>{restaurant.name}</h1>

          {restaurant.description && (
            <p className={styles.description}>{restaurant.description}</p>
          )}
        </section>

        {/* -----------------------------
            Order entry
        ------------------------------ */}
        <Card className={styles.entryCard}>
          <div>
            <h2 className={styles.welcomeTitle}>Welcome</h2>

            <p className={styles.helperText}>
              Confirm your table information before starting your order.
            </p>
          </div>

          {/* -----------------------------
              Table information
          ------------------------------ */}
          <div className={styles.tableSection}>
            <p className={styles.tableLabel}>YOUR TABLE</p>

            <h3 className={styles.tableName}>{table.name}</h3>

            <div className={styles.tableDetails}>
              <p className={styles.tableMeta}>
                Table Number: {table.tableNumber}
              </p>

              {table.capacity && (
                <p className={styles.tableMeta}>Capacity: {table.capacity}</p>
              )}
            </div>
          </div>

          <p className={styles.confirmationText}>
            You&apos;re ordering from this table.
          </p>

          {/* -----------------------------
              Start order
          ------------------------------ */}
          <Button
            className={styles.startButton}
            onClick={() => router.push("/order/menu")}
          >
            Start Order
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default QREntry;
