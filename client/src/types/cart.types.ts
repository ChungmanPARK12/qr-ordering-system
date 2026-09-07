// src/types/cart.types.ts

import type { ReactNode } from "react";

// -----------------------------
// Cart Option
// -----------------------------

export type CartOptionItem = {
  optionGroupId: string;
  optionGroupName: string;
  optionItemId: string;
  optionItemName: string;

  // Additional price in cents
  additionalPrice: number;
};

// -----------------------------
// Cart Item
// -----------------------------

export type CartItem = {
  // Unique Cart line ID
  id: string;

  // Original MenuItem ID
  menuItemId: string;

  // Snapshot for cart / future order display
  menuItemName: string;

  // Base menu price in cents
  basePrice: number;

  // Selected option configuration
  selectedOptions: CartOptionItem[];

  quantity: number;

  // basePrice + selected option prices
  unitPrice: number;

  // unitPrice * quantity
  subtotal: number;
};

// -----------------------------
// Cart Input
// -----------------------------

export type AddCartItemInput = {
  menuItemId: string;
  menuItemName: string;
  basePrice: number;
  selectedOptions: CartOptionItem[];
  quantity: number;
};

// -----------------------------
// Cart Context
// -----------------------------

export type CartContextValue = {
  items: CartItem[];

  addItem: (item: AddCartItemInput) => void;

  removeItem: (cartItemId: string) => void;

  updateQuantity: (cartItemId: string, quantity: number) => void;

  clearCart: () => void;

  totalPrice: number;
};

// -----------------------------
// Component Props
// -----------------------------

export type CartProviderProps = {
  children: ReactNode;
};
