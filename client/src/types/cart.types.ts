// src/types/cart.types.ts

export type CartOptionItem = {
  optionGroupId: string;
  optionGroupName: string;

  optionItemId: string;
  optionItemName: string;

  // Additional price in cents
  additionalPrice: number;
};

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
