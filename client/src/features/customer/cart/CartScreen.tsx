"use client";

import { useCart } from "@/features/customer/context/CartContext";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";
import { useRouter } from "next/navigation";

const CartScreen = () => {
  const router = useRouter();
  const { session } = useOrderSession();

  const { items, totalPrice, updateQuantity, removeItem } = useCart();

  // Prevent direct access without QR session
  if (!session) {
    return (
      <div>
        <h1>No Order Session</h1>
        <p>Please scan the table QR code first.</p>
      </div>
    );
  }

  return (
    <main>
      <h1>Cart</h1>

      <p>Restaurant: {session.restaurant.name}</p>

      <p>Table: {session.table.name}</p>

      <hr />

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <section key={item.id}>
              <h2>{item.menuItemName}</h2>

              {/* Selected Options */}
              {item.selectedOptions.length > 0 && (
                <div>
                  <h3>Options</h3>

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
                </div>
              )}

              {/* Quantity control */}
              <div>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>

                <span
                  style={{
                    margin: "0 12px",
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <p>Unit Price: ${(item.unitPrice / 100).toFixed(2)}</p>

              <p>Subtotal: ${(item.subtotal / 100).toFixed(2)}</p>

              {/* Remove Cart Item */}
              <button onClick={() => removeItem(item.id)}>Remove</button>

              <hr />
            </section>
          ))}

          {/* Cart Total */}
          <section>
            <h2>Total: ${(totalPrice / 100).toFixed(2)}</h2>
          </section>

          <button onClick={() => router.push("/order/checkout")}>
            Proceed to Checkout
          </button>
        </>
      )}
    </main>
  );
};

export default CartScreen;
