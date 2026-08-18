export type Category = {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
  restaurantId: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sortOrder: number;
  isVisible: boolean;
  isSoldOut: boolean;
  restaurantId: string;
  categoryId: string;
};
