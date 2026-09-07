import type { QrEntryResponse } from "@/types/restaurant.types";

import type { CustomerMenuResponse, MenuItemDetail } from "@/types/menu.types";

import type {
  CreateCustomerOrderInput,
  CreateCustomerOrderResponse,
} from "@/types/order.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export const validateQrEntry = async (
  restaurantId: string,
  tableId: string,
): Promise<QrEntryResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/qr/validate?restaurantId=${restaurantId}&tableId=${tableId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to validate QR entry.");
  }

  return data.data;
};

export const getCustomerMenu = async (
  restaurantId: string,
): Promise<CustomerMenuResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants/${restaurantId}/menu`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load menu.");
  }

  return data.data;
};

export const getCustomerMenuItem = async (
  restaurantId: string,
  menuItemId: string,
): Promise<MenuItemDetail> => {
  const response = await fetch(
    `${API_BASE_URL}/api/restaurants/${restaurantId}/menu/${menuItemId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load menu item.");
  }

  return data.data;
};

export const createCustomerOrder = async (
  input: CreateCustomerOrderInput,
): Promise<CreateCustomerOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order.");
  }

  return data.data;
};
