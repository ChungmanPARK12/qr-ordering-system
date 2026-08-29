"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import styles from "./OrderConfirmation.module.css";

const OrderConfirmation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { session } = useOrderSession();

  const orderNumber = searchParams.get("orderNumber");
  const total = searchParams.get("total");

  // -----------------------------
  // Prevent direct access
  // without QR session
  // -----------------------------
  if (!session) {
    return (
      <main className={styles.statusPage}>
        <Card className={styles.statusCard}>
          <h1 className={styles.statusTitle}>No Order Session</h1>

          <p className={styles.statusMessage}>
            Please scan the table QR code first.
          </p>
        </Card>
      </main>
    );
  }

  // -----------------------------
  // Invalid confirmation data
  // -----------------------------
  if (!orderNumber || !total) {
    return (
      <main className={styles.statusPage}>
        <Card className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Invalid Order Confirmation</h1>

          <p className={styles.statusMessage}>Order information is missing.</p>
        </Card>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Card className={styles.confirmationCard}>
        {/* -----------------------------
            Success State
        ------------------------------ */}
        <div className={styles.successIcon}>✓</div>

        <div className={styles.successHeader}>
          <h1 className={styles.pageTitle}>Order Confirmed</h1>

          <p className={styles.confirmationMessage}>
            Your order has been received and is being prepared.
          </p>
        </div>

        {/* -----------------------------
            Order Number
        ------------------------------ */}
        <div className={styles.orderNumberSection}>
          <span className={styles.orderNumberLabel}>Order Number</span>

          <strong className={styles.orderNumber}>{orderNumber}</strong>
        </div>

        {/* -----------------------------
            Order Information
        ------------------------------ */}
        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Restaurant</span>

            <span className={styles.infoValue}>{session.restaurant.name}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Table</span>

            <span className={styles.infoValue}>{session.table.name}</span>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>

            <span className={styles.totalPrice}>
              ${(Number(total) / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* -----------------------------
            Final Message
        ------------------------------ */}
        <p className={styles.helperMessage}>
          Please remain at your table while your order is prepared.
        </p>

        <Button
          className={styles.returnButton}
          onClick={() => router.push("/order/menu")}
        >
          Return to Menu
        </Button>
      </Card>
    </main>
  );
};

export default OrderConfirmation;
