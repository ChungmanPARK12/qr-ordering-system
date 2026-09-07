"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";

import { validateQrEntry } from "@/lib/api/customerApi";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import type { QrEntryResponse } from "@/types/restaurant.types";

import styles from "./QREntry.module.css";

const QREntry = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setSession } = useOrderSession();

  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  const [entryData, setEntryData] = useState<QrEntryResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -----------------------------
  // Validate QR entry from backend
  // -----------------------------
  useEffect(() => {
    if (!restaurantId || !tableId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadQrEntry = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await validateQrEntry(restaurantId, tableId);

        if (cancelled) return;

        setEntryData(data);

        setSession({
          restaurant: data.restaurant,
          table: data.table,
        });
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : "Failed to validate QR entry.";

        setErrorMessage(message);
        setEntryData(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadQrEntry();

    return () => {
      cancelled = true;
    };
  }, [restaurantId, tableId, setSession]);

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
  // Loading
  // -----------------------------
  if (isLoading) {
    return (
      <main className={styles.statusPage}>
        <Card className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Checking QR Code...</h1>

          <p className={styles.statusMessage}>
            Please wait while we confirm your restaurant and table.
          </p>
        </Card>
      </main>
    );
  }

  // -----------------------------
  // Backend validation error
  // -----------------------------
  if (errorMessage) {
    if (errorMessage === "Restaurant not found.") {
      return renderStatusPage("Restaurant Not Found", errorMessage);
    }

    if (errorMessage === "Table not found.") {
      return renderStatusPage("Table Not Found", errorMessage);
    }

    if (errorMessage === "Table does not belong to this restaurant.") {
      return renderStatusPage("Invalid Table", errorMessage);
    }

    if (errorMessage === "Restaurant is currently unavailable.") {
      return renderStatusPage("Restaurant Unavailable", errorMessage);
    }

    if (errorMessage === "Table is currently unavailable.") {
      return renderStatusPage("Table Unavailable", errorMessage);
    }

    return renderStatusPage("Unable to Start Order", errorMessage);
  }

  // -----------------------------
  // Missing API response
  // -----------------------------
  if (!entryData) {
    return renderStatusPage(
      "Unable to Start Order",
      "Restaurant and table information could not be loaded.",
    );
  }

  const { restaurant, table } = entryData;

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
