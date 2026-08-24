import type { ReactNode } from "react";

import { OrderSessionProvider } from "@/features/customer/context/OrderSessionContext";
import { CartProvider } from "@/features/customer/context/CartContext";

type OrderLayoutProps = {
  children: ReactNode;
};

export default function OrderLayout({ children }: OrderLayoutProps) {
  return (
    <OrderSessionProvider>
      <CartProvider>{children}</CartProvider>
    </OrderSessionProvider>
  );
}
