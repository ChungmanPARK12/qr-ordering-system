// Menu types

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

// Option types

export type OptionSelectionType = "single" | "multiple";

export type OptionGroup = {
  id: string;
  name: string;

  selectionType: OptionSelectionType;

  isRequired: boolean;
  minSelection: number;
  maxSelection: number;

  sortOrder: number;

  restaurantId: string;

  // Menu items using this option group
  menuItemIds: string[];
};

export type OptionItem = {
  id: string;
  name: string;

  // Stored in cents
  additionalPrice: number;

  sortOrder: number;

  optionGroupId: string;
};
