// src/types/order.types.ts

// -----------------------------
// Create Order Input
// -----------------------------

export type CreateCustomerOrderItemInput = {
  menuItemId: string;
  quantity: number;
  optionItemIds: string[];
};

export type CreateCustomerOrderInput = {
  restaurantId: string;
  tableId: string;
  customerNote?: string;
  items: CreateCustomerOrderItemInput[];
};

export type CreateCustomerOrderResponse = {
  id: string;
  orderNumber: string;
  subtotalAmount: number;
  totalAmount: number;
};
