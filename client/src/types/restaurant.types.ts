// src/types/restaurant.types.ts

import type { ReactNode } from "react";

// -----------------------------
// Restaurant
// -----------------------------

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
};

// -----------------------------
// Restaurant Table
// -----------------------------

export type RestaurantTable = {
  id: string;
  name: string;
  qrCode?: string;
  tableNumber: number;
  capacity?: number;
  status: "ACTIVE" | "INACTIVE";
  isActive: boolean;
  restaurantId: string;
};

// -----------------------------
// Order Session
// -----------------------------

export type OrderSession = {
  restaurant: Restaurant;
  table: RestaurantTable;
};

// -----------------------------
// Order Session Context
// -----------------------------

export type OrderSessionContextType = {
  session: OrderSession | null;
  setSession: (session: OrderSession) => void;
  clearSession: () => void;
};

// -----------------------------
// Component Props
// -----------------------------

export type OrderSessionProviderProps = {
  children: ReactNode;
};

export type QrEntryResponse = {
  restaurant: Restaurant;
  table: RestaurantTable;
};
