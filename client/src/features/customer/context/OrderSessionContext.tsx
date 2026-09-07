"use client";

import { createContext, useCallback, useContext, useState } from "react";

import type {
  OrderSession,
  OrderSessionContextType,
  OrderSessionProviderProps,
} from "@/types/restaurant.types";

const OrderSessionContext = createContext<OrderSessionContextType | undefined>(
  undefined,
);

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
