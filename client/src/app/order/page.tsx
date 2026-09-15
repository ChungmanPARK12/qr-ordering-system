import { Suspense } from "react";
import QREntry from "@/features/customer/qr-entry/QREntry";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <QREntry />
    </Suspense>
  );
}
