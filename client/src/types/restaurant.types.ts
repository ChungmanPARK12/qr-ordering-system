export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
};

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
