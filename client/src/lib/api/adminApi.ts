import type { Category, MenuItem } from "@/types/menu.types";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "@/types/admin.types";

import { handleResponse } from "./shared/apiResponse";
import { API_BASE_URL } from "./shared/apiConfig";

// -----------------------------
// Category
// -----------------------------

export const getAdminCategories = async (
  restaurantId: string,
): Promise<Category[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/categories`,
  );

  return handleResponse<Category[]>(response);
};

export const createAdminCategory = async (
  restaurantId: string,
  input: CreateCategoryInput,
): Promise<Category> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/categories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<Category>(response);
};

export const updateAdminCategory = async (
  restaurantId: string,
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<Category> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/categories/${categoryId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<Category>(response);
};

export const deleteAdminCategory = async (
  restaurantId: string,
  categoryId: string,
): Promise<Category> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<Category>(response);
};

// -----------------------------
// Menu Item
// -----------------------------

export const getAdminMenuItems = async (
  restaurantId: string,
): Promise<MenuItem[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/menu-items`,
  );

  return handleResponse<MenuItem[]>(response);
};

export const createAdminMenuItem = async (
  restaurantId: string,
  input: CreateMenuItemInput,
): Promise<MenuItem> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/menu-items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<MenuItem>(response);
};

export const updateAdminMenuItem = async (
  restaurantId: string,
  menuItemId: string,
  input: UpdateMenuItemInput,
): Promise<MenuItem> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/menu-items/${menuItemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<MenuItem>(response);
};

export const deleteAdminMenuItem = async (
  restaurantId: string,
  menuItemId: string,
): Promise<MenuItem> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/menu-items/${menuItemId}`,
    {
      method: "DELETE",
    },
  );

  return handleResponse<MenuItem>(response);
};
