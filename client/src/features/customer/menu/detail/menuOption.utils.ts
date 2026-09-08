import type { CartOptionItem } from "@/types/cart.types";
import type { MenuItemDetail } from "@/types/menu.types";

export const validateOptionSelections = (
  optionGroups: MenuItemDetail["optionGroups"],
  selectedOptions: Record<string, string[]>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  optionGroups.forEach((group) => {
    const selectedCount = selectedOptions[group.id]?.length ?? 0;

    if (selectedCount < group.minSelection) {
      errors[group.id] =
        `Please select at least ${group.minSelection} option(s).`;
      return;
    }

    if (selectedCount > group.maxSelection) {
      errors[group.id] =
        `You can select up to ${group.maxSelection} option(s).`;
    }
  });

  return errors;
};

export const buildCartOptions = (
  optionGroups: MenuItemDetail["optionGroups"],
  selectedOptions: Record<string, string[]>,
): CartOptionItem[] => {
  const cartOptions: CartOptionItem[] = [];

  optionGroups.forEach((group) => {
    const selectedIds = selectedOptions[group.id] ?? [];

    selectedIds.forEach((optionItemId) => {
      const optionItem = group.optionItems.find(
        (item) => item.id === optionItemId,
      );

      if (!optionItem) {
        return;
      }

      cartOptions.push({
        optionGroupId: group.id,
        optionGroupName: group.name,
        optionItemId: optionItem.id,
        optionItemName: optionItem.name,
        additionalPrice: optionItem.additionalPrice,
      });
    });
  });

  return cartOptions;
};
