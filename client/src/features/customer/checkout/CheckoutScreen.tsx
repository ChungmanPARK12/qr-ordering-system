"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";

import { useCart } from "@/features/customer/context/CartContext";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import styles from "./CheckoutScreen.module.css";

const CheckoutScreen = () => {
  const router = useRouter();

  const { session } = useOrderSession();
  const { items, totalPrice, clearCart } = useCart();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
  // Prevent checkout
  // with empty Cart
  // -----------------------------
  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Checkout</h1>

          <div className={styles.orderContext}>
            <span>{session.restaurant.name}</span>
            <span className={styles.contextDivider}>•</span>
            <span>{session.table.name}</span>
          </div>
        </header>

        <Card className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>

          <p className={styles.emptyMessage}>
            Add some items before proceeding to checkout.
          </p>

          <Button
            className={styles.emptyButton}
            onClick={() => router.push("/order/menu")}
          >
            Return to Menu
          </Button>
        </Card>
      </main>
    );
  }

  // -----------------------------
  // Place Order
  // -----------------------------
  const handlePlaceOrder = () => {
    if (isPlacingOrder) {
      return;
    }

    setIsPlacingOrder(true);

    const mockOrderNumber = `ORDER-${Date.now()}`;

    router.push(
      `/order/confirmation?orderNumber=${mockOrderNumber}&total=${totalPrice}`,
    );

    clearCart();
  };

  return (
    <main className={styles.page}>
      {/* -----------------------------
          Header
      ------------------------------ */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Checkout</h1>

        <div className={styles.orderContext}>
          <span>{session.restaurant.name}</span>
          <span className={styles.contextDivider}>•</span>
          <span>{session.table.name}</span>
        </div>
      </header>

      {/* -----------------------------
          Order Information
      ------------------------------ */}
      <Card className={styles.orderInfoCard}>
        <h2 className={styles.sectionTitle}>Order Information</h2>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Restaurant</span>
          <span className={styles.infoValue}>{session.restaurant.name}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Table</span>
          <span className={styles.infoValue}>{session.table.name}</span>
        </div>
      </Card>

      {/* -----------------------------
          Order Summary
      ------------------------------ */}
      <section className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>

        <div className={styles.summaryList}>
          {items.map((item) => (
            <Card key={item.id} className={styles.summaryCard}>
              <div className={styles.itemHeader}>
                <div>
                  <h3 className={styles.itemName}>{item.menuItemName}</h3>

                  <p className={styles.quantityText}>
                    Quantity: {item.quantity}
                  </p>
                </div>

                <span className={styles.itemSubtotal}>
                  ${(item.subtotal / 100).toFixed(2)}
                </span>
              </div>

              {item.selectedOptions.length > 0 && (
                <div className={styles.optionsSection}>
                  {item.selectedOptions.map((option) => (
                    <div
                      key={`${option.optionGroupId}-${option.optionItemId}`}
                      className={styles.optionRow}
                    >
                      <div className={styles.optionInfo}>
                        <span className={styles.optionGroup}>
                          {option.optionGroupName}
                        </span>

                        <span className={styles.optionName}>
                          {option.optionItemName}
                        </span>
                      </div>

                      {option.additionalPrice > 0 && (
                        <span className={styles.optionPrice}>
                          +$
                          {(option.additionalPrice / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* -----------------------------
          Total
      ------------------------------ */}
      <section className={styles.totalSection}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total</span>

          <span className={styles.totalPrice}>
            ${(totalPrice / 100).toFixed(2)}
          </span>
        </div>

        <Button
          className={styles.placeOrderButton}
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>

        <Button
          variant="secondary"
          className={styles.backButton}
          onClick={() => router.push("/order/cart")}
          disabled={isPlacingOrder}
        >
          Back to Cart
        </Button>
      </section>
    </main>
  );
};

export default CheckoutScreen;
