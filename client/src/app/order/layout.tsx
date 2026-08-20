import type { ReactNode } from "react";

import { OrderSessionProvider } from "@/features/customer/context/OrderSessionContext";

type OrderLayoutProps = {
  children: ReactNode;
};

export default function OrderLayout({ children }: OrderLayoutProps) {
  return <OrderSessionProvider>{children}</OrderSessionProvider>;
}
