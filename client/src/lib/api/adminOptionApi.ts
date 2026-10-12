// api/adminOption, OptionGroups

import type { OptionGroup } from "@/types/menu.types";
import { handleResponse } from "./shared/apiResponse";
import { API_BASE_URL } from "./shared/apiConfig";

export const getAdminOptionGroups = async (
  restaurantId: string,
): Promise<OptionGroup[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/restaurants/${restaurantId}/option-groups`,
  );

  return handleResponse<OptionGroup[]>(response);
};
