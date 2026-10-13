
import type {
  OptionGroup,
  OptionItem,
} from "@/types/menu.types";

import type {
  CreateOptionGroupInput,
  UpdateOptionGroupInput,
  CreateOptionItemInput,
} from "@/types/admin.types";

import { handleResponse } from "./shared/apiResponse";
import { API_BASE_URL } from "./shared/apiConfig";

// -----------------------------
// GET Option Groups
// -----------------------------
export const getAdminOptionGroups = async (
  restaurantId: string,
): Promise<OptionGroup[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/option-groups`,
  );

  return handleResponse<OptionGroup[]>(response);
};

// -----------------------------
// POST Option Group
// -----------------------------
export const createAdminOptionGroup = async (
  restaurantId: string,
  input: CreateOptionGroupInput,
): Promise<OptionGroup> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/option-groups`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<OptionGroup>(response);
};

// -----------------------------
// PATCH Option Group
// -----------------------------
export const updateAdminOptionGroup = async (
  restaurantId: string,
  optionGroupId: string,
  input: UpdateOptionGroupInput,
): Promise<OptionGroup> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/option-groups/${optionGroupId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<OptionGroup>(response);
};

// -----------------------------
// DELETE Option Group
// -----------------------------
export const deleteAdminOptionGroup = async (
  restaurantId: string,
  optionGroupId: string,
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/option-groups/${optionGroupId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    await handleResponse<unknown>(response);
    throw new Error("Failed to delete option group.");
  }
};

// -----------------------------
// POST Option Item
// -----------------------------
export const createAdminOptionItem = async (
  restaurantId: string,
  optionGroupId: string,
  input: CreateOptionItemInput,
): Promise<OptionItem> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/option-groups/${optionGroupId}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  return handleResponse<OptionItem>(response);
};
