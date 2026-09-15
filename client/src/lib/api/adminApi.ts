// client/src/lib/api/adminApi.ts

import type { Category, MenuItem } from "@/types/menu.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  code?: string;
  message?: string;
};

// Category
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as ApiResponse<T> | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message ? data.message : "Request failed.",
    );
  }

  if (!("data" in data)) {
    throw new Error("Invalid API response.");
  }

  return data.data;
};

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
