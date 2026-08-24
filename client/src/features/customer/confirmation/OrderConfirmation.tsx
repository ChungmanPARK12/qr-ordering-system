"use client";

import { useSearchParams } from "next/navigation";
import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

const OrderConfirmation = () => {
  const searchParams = useSearchParams();
  const { session } = useOrderSession();

  const orderNumber = searchParams.get("orderNumber");
  const total = searchParams.get("total");

  if (!session) {
    return (
      <main>
        <h1>No Order Session</h1>
        <p>Please scan the table QR code first.</p>
      </main>
    );
  }

  if (!orderNumber || !total) {
    return (
      <main>
        <h1>Invalid Order Confirmation</h1>
        <p>Order information is missing.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Order Confirmed</h1>

      <p>Your order has been received.</p>

      <hr />

      <h2>Order Information</h2>

      <p>Order Number: {orderNumber}</p>

      <p>Restaurant: {session.restaurant.name}</p>

      <p>Table: {session.table.name}</p>

      <p>Total: ${(Number(total) / 100).toFixed(2)}</p>
    </main>
  );
};

export default OrderConfirmation;
