import type { OptionSelectionType } from "./menu.types";

// Category
export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// Menu Item
export type CreateMenuItemInput = {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
  isSoldOut?: boolean;
  categoryId: string;
};

// Option Group
export type CreateOptionGroupInput = {
  name: string;
  selectionType: OptionSelectionType;
  isRequired?: boolean;
  minSelection?: number;
  maxSelection?: number;
  sortOrder?: number;
};

export type CreateOptionItemInput = {
  name: string;
  additionalPrice?: number;
  sortOrder?: number;
};

export type UpdateOptionItemInput = Partial<CreateOptionItemInput>;
export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;
export type UpdateOptionGroupInput = Partial<CreateOptionGroupInput>;
