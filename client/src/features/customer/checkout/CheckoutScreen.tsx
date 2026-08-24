"use client";

import { useCart } from "@/features/customer/context/CartContext";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";
import { useRouter } from "next/navigation";

const CheckoutScreen = () => {
  const router = useRouter();

  const { session } = useOrderSession();
  const { items, totalPrice, clearCart } = useCart();

  // Prevent direct access without QR session
  if (!session) {
    return (
      <main>
        <h1>No Order Session</h1>
        <p>Please scan the table QR code first.</p>
      </main>
    );
  }

  // Prevent checkout with empty Cart
  if (items.length === 0) {
    return (
      <main>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Checkout</h1>

      {/* Restaurant / Table */}
      <section>
        <h2>Order Information</h2>

        <p>Restaurant: {session.restaurant.name}</p>
        <p>Table: {session.table.name}</p>
      </section>

      <hr />

      {/* Order Summary */}
      <section>
        <h2>Order Summary</h2>

        {items.map((item) => (
          <div key={item.id}>
            <h3>{item.menuItemName}</h3>

            {item.selectedOptions.map((option) => (
              <p key={`${option.optionGroupId}-${option.optionItemId}`}>
                {option.optionGroupName}: {option.optionItemName}
                {option.additionalPrice > 0 && (
                  <>
                    {" "}
                    +$
                    {(option.additionalPrice / 100).toFixed(2)}
                  </>
                )}
              </p>
            ))}

            <p>Quantity: {item.quantity}</p>

            <p>Subtotal: ${(item.subtotal / 100).toFixed(2)}</p>
          </div>
        ))}
      </section>

      <hr />

      {/* Total */}
      <section>
        <h2>Total: ${(totalPrice / 100).toFixed(2)}</h2>
      </section>

      <button
        onClick={() => {
          const mockOrderNumber = `ORDER-${Date.now()}`;

          router.push(
            `/order/confirmation?orderNumber=${mockOrderNumber}&total=${totalPrice}`,
          );

          clearCart();
        }}
      >
        Place Order
      </button>
    </main>
  );
};

export default CheckoutScreen;
