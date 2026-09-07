// src/features/customer/context/CartContext.tsx

"use client";

import { createContext, useContext, useState } from "react";

import type {
  AddCartItemInput,
  CartContextValue,
  CartItem,
  CartOptionItem,
  CartProviderProps,
} from "@/types/cart.types";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // -----------------------------
  // Calculate configured unit price
  // -----------------------------
  const calculateUnitPrice = (
    basePrice: number,
    selectedOptions: CartOptionItem[],
  ) => {
    const optionTotal = selectedOptions.reduce(
      (total, option) => total + option.additionalPrice,
      0,
    );

    return basePrice + optionTotal;
  };

  // -----------------------------
  // Compare Option combinations
  // -----------------------------
  const haveSameOptions = (
    firstOptions: CartOptionItem[],
    secondOptions: CartOptionItem[],
  ) => {
    if (firstOptions.length !== secondOptions.length) {
      return false;
    }

    const firstIds = firstOptions.map((option) => option.optionItemId).sort();

    const secondIds = secondOptions.map((option) => option.optionItemId).sort();

    return firstIds.every((id, index) => id === secondIds[index]);
  };

  // -----------------------------
  // Add Item to Cart
  // -----------------------------
  const addItem = (input: AddCartItemInput) => {
    const unitPrice = calculateUnitPrice(
      input.basePrice,
      input.selectedOptions,
    );

    setItems((prev) => {
      // Same menu + same option combination
      const existingItem = prev.find(
        (item) =>
          item.menuItemId === input.menuItemId &&
          haveSameOptions(item.selectedOptions, input.selectedOptions),
      );

      // Merge quantity if same configuration exists
      if (existingItem) {
        return prev.map((item) => {
          if (item.id !== existingItem.id) {
            return item;
          }

          const newQuantity = item.quantity + input.quantity;

          return {
            ...item,
            quantity: newQuantity,
            subtotal: item.unitPrice * newQuantity,
          };
        });
      }

      // Different option combination
      // creates a new Cart Item.
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,

        menuItemId: input.menuItemId,

        menuItemName: input.menuItemName,

        basePrice: input.basePrice,

        selectedOptions: input.selectedOptions,

        quantity: input.quantity,

        unitPrice,

        subtotal: unitPrice * input.quantity,
      };

      return [...prev, newItem];
    });
  };

  // -----------------------------
  // Remove Cart Item
  // -----------------------------
  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // -----------------------------
  // Update Cart Item quantity
  // -----------------------------
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,

              quantity,

              subtotal: item.unitPrice * quantity,
            }
          : item,
      ),
    );
  };

  // -----------------------------
  // Clear entire Cart
  // -----------------------------
  const clearCart = () => {
    setItems([]);
  };

  // -----------------------------
  // Calculate entire Cart total
  // -----------------------------
  const totalPrice = items.reduce((total, item) => total + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// -----------------------------
// Cart Context Hook
// -----------------------------
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
