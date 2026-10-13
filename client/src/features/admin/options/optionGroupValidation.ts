import type { CreateOptionGroupInput } from "@/types/admin.types";

/**
 * Validate OptionGroup input before sending
 * CREATE or UPDATE requests to the backend.
 *
 * Backend remains the final validation boundary.
 */
export const validateOptionGroupInput = (
  input: CreateOptionGroupInput,
): boolean => {
  const {
    name,
    selectionType,
    isRequired = false,
    minSelection = 0,
    maxSelection = 1,
  } = input;

  // 1. Name must not be empty
  if (!name.trim()) {
    return false;
  }

  // 2. Minimum selection must be a non-negative integer
  if (!Number.isInteger(minSelection) || minSelection < 0) {
    return false;
  }

  // 3. Maximum selection must be a positive integer
  if (!Number.isInteger(maxSelection) || maxSelection < 1) {
    return false;
  }

  // 4. Minimum cannot exceed maximum
  if (minSelection > maxSelection) {
    return false;
  }

  // 5. SINGLE groups allow at most one selection
  if (selectionType === "SINGLE" && maxSelection !== 1) {
    return false;
  }

  // 6. Required groups must require at least one selection
  if (isRequired && minSelection < 1) {
    return false;
  }

  // 7. Optional groups cannot require a minimum selection
  if (!isRequired && minSelection !== 0) {
    return false;
  }

  return true;
};
