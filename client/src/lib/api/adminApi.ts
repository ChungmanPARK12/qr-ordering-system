// client/src/lib/api/adminApi.ts

import type { Category, MenuItem } from "@/types/menu.types";
import { handleResponse } from "./shared/apiResponse";
import { API_BASE_URL } from "./shared/apiConfig";

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
  input: {
    name: string;
    description?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
  },
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
  input: {
    name?: string;
    description?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
  },
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

export const getAdminMenuItems = async (
  restaurantId: string,
): Promise<MenuItem[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/menu-items`,
  );

  return handleResponse<MenuItem[]>(response);
};

// Menu item
export const createAdminMenuItem = async (
  restaurantId: string,
  input: {
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
    isSoldOut?: boolean;
    categoryId: string;
  },
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
  input: {
    name?: string;
    description?: string | null;
    price?: number;
    imageUrl?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
    isSoldOut?: boolean;
    categoryId?: string;
  },
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
