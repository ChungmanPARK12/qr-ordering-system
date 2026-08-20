"use client";

import { useOrderSession } from "@/features/customer/context/OrderSessionContext";

export default function Page() {
  const { session } = useOrderSession();

  if (!session) {
    return (
      <div>
        <h1>No Order Session</h1>

        <p>Please scan the table QR code first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Menu</h1>

      <p>Restaurant: {session.restaurant.name}</p>

      <p>Table: {session.table.name}</p>

      <p>Table Number: {session.table.tableNumber}</p>
    </div>
  );
}
