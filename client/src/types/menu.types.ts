// -----------------------------
// Component Props
// -----------------------------

export type MenuDetailProps = {
  menuItemId: string;
};

// -----------------------------
// Category
// -----------------------------

export type Category = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isVisible: boolean;
  restaurantId: string;
};

export type MenuCategory = Category & {
  menuItems: MenuItem[];
};

// -----------------------------
// Menu
// -----------------------------

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
  isSoldOut: boolean;
  restaurantId: string;
  categoryId: string;
};

export type MenuItemDetail = MenuItem & {
  optionGroups: OptionGroup[];
};

// -----------------------------
// Option
// -----------------------------

export type OptionSelectionType = "SINGLE" | "MULTIPLE";

export type OptionGroup = {
  id: string;
  name: string;
  selectionType: OptionSelectionType;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
  sortOrder: number;
  restaurantId: string;
  optionItems: OptionItem[];
};

export type OptionItem = {
  id: string;
  name: string;
  additionalPrice: number;
  sortOrder: number;
  optionGroupId: string;
};

// -----------------------------
// API Response
// -----------------------------

export type CustomerMenuResponse = MenuCategory[];
