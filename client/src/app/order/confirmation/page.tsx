import { Suspense } from "react";
import OrderConfirmation from "@/features/customer/confirmation/OrderConfirmation";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading confirmation...</div>}>
      <OrderConfirmation />
    </Suspense>
  );
}
