"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Restaurant, RestaurantTable } from "@/types/restaurant.types";

type OrderSession = {
  restaurant: Restaurant;
  table: RestaurantTable;
};

type OrderSessionContextType = {
  session: OrderSession | null;
  setSession: (session: OrderSession) => void;
  clearSession: () => void;
};

const OrderSessionContext = createContext<OrderSessionContextType | undefined>(
  undefined,
);

type OrderSessionProviderProps = {
  children: ReactNode;
};

export const OrderSessionProvider = ({
  children,
}: OrderSessionProviderProps) => {
  const [session, setSessionState] = useState<OrderSession | null>(null);

  // Keep function reference stable between renders
  const setSession = useCallback((newSession: OrderSession) => {
    setSessionState(newSession);
  }, []);

  // Keep function reference stable between renders
  const clearSession = useCallback(() => {
    setSessionState(null);
  }, []);

  return (
    <OrderSessionContext.Provider
      value={{
        session,
        setSession,
        clearSession,
      }}
    >
      {children}
    </OrderSessionContext.Provider>
  );
};

export const useOrderSession = () => {
  const context = useContext(OrderSessionContext);

  if (!context) {
    throw new Error("useOrderSession must be used inside OrderSessionProvider");
  }

  return context;
};
