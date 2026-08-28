"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button/Button";
import Card from "@/components/ui/Card/Card";
import QuantityControl from "@/components/ui/QuantityControl/QuantityControl";

import { useCart } from "@/features/customer/context/CartContext";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

import styles from "./CartScreen.module.css";

const CartScreen = () => {
  const router = useRouter();

  const { session } = useOrderSession();

  const { items, totalPrice, updateQuantity, removeItem } = useCart();

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

  return (
    <main className={styles.page}>
      {/* -----------------------------
          Header
      ------------------------------ */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Your Cart</h1>

        <div className={styles.orderContext}>
          <span>{session.restaurant.name}</span>
          <span className={styles.contextDivider}>•</span>
          <span>{session.table.name}</span>
        </div>
      </header>

      {/* -----------------------------
          Empty Cart
      ------------------------------ */}
      {items.length === 0 ? (
        <Card className={styles.emptyCard}>
          <div className={styles.emptyIcon}>🛒</div>

          <h2 className={styles.emptyTitle}>Your cart is empty</h2>

          <p className={styles.emptyMessage}>
            Add some items from the menu to start your order.
          </p>

          <Button
            className={styles.continueButton}
            onClick={() => router.push("/order/menu")}
          >
            Continue Ordering
          </Button>
        </Card>
      ) : (
        <>
          {/* -----------------------------
              Cart Items
          ------------------------------ */}
          <section className={styles.cartList}>
            {items.map((item) => (
              <Card key={item.id} className={styles.cartItem}>
                <div className={styles.itemHeader}>
                  <div>
                    <h2 className={styles.itemName}>{item.menuItemName}</h2>

                    <p className={styles.unitPrice}>
                      ${(item.unitPrice / 100).toFixed(2)} each
                    </p>
                  </div>

                  <p className={styles.itemSubtotal}>
                    ${(item.subtotal / 100).toFixed(2)}
                  </p>
                </div>

                {/* -----------------------------
                    Selected Options
                ------------------------------ */}
                {item.selectedOptions.length > 0 && (
                  <div className={styles.optionsSection}>
                    <p className={styles.optionsTitle}>Selected Options</p>

                    <div className={styles.optionList}>
                      {item.selectedOptions.map((option) => (
                        <div
                          key={`${option.optionGroupId}-${option.optionItemId}`}
                          className={styles.optionRow}
                        >
                          <div className={styles.optionInfo}>
                            <span className={styles.optionGroupName}>
                              {option.optionGroupName}
                            </span>

                            <span className={styles.optionItemName}>
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
                  </div>
                )}

                {/* -----------------------------
                    Actions
                ------------------------------ */}
                <div className={styles.itemActions}>
                  <QuantityControl
                    value={item.quantity}
                    min={1}
                    max={99}
                    onChange={(value) => updateQuantity(item.id, value)}
                  />

                  <Button
                    variant="destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </section>

          {/* -----------------------------
              Cart Summary
          ------------------------------ */}
          <section className={styles.summarySection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>

              <span className={styles.totalPrice}>
                ${(totalPrice / 100).toFixed(2)}
              </span>
            </div>

            <Button
              className={styles.checkoutButton}
              onClick={() => router.push("/order/checkout")}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="secondary"
              className={styles.continueOrderingButton}
              onClick={() => router.push("/order/menu")}
            >
              Continue Ordering
            </Button>
          </section>
        </>
      )}
    </main>
  );
};

export default CartScreen;
