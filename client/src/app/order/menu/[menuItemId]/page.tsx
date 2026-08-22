// src/app/order/menu/[menuItemId]/page.tsx

import MenuDetail from "@/features/customer/menu/MenuDetail";

type PageProps = {
  params: Promise<{
    menuItemId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { menuItemId } = await params;

  return <MenuDetail menuItemId={menuItemId} />;
}
