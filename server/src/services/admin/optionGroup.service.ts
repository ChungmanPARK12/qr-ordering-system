import type { OptionSelectionType } from "../../generated/prisma/enums";
import prisma from "../../lib/prisma";

/**
 * Validate business rules for OptionGroup selection constraints.
 */
const validateOptionGroupConstraints = (data: {
  selectionType: OptionSelectionType;
  isRequired: boolean;
  minSelection: number;
  maxSelection: number;
}) => {
  const { selectionType, isRequired, minSelection, maxSelection } = data;

  // minSelection cannot be negative
  if (minSelection < 0) {
    throw new Error("INVALID_OPTION_GROUP_CONSTRAINTS");
  }

  // At least one option must be selectable
  if (maxSelection < 1) {
    throw new Error("INVALID_OPTION_GROUP_CONSTRAINTS");
  }

  // Minimum cannot exceed maximum
  if (minSelection > maxSelection) {
    throw new Error("INVALID_OPTION_GROUP_CONSTRAINTS");
  }

  // SINGLE groups can select at most one option
  if (selectionType === "SINGLE" && maxSelection !== 1) {
    throw new Error("INVALID_OPTION_GROUP_CONSTRAINTS");
  }

  // Required groups must require at least one selection
  if (isRequired && minSelection < 1) {
    throw new Error("INVALID_OPTION_GROUP_CONSTRAINTS");
  }

  // Optional groups cannot require a minimum selection
  if (!isRequired && minSelection !== 0) {
    throw new Error("INVALID_OPTION_GROUP_CONSTRAINTS");
  }
};

/**
 * Get all OptionGroups belonging to a restaurant.
 */
export const getOptionGroupsByRestaurant = async (restaurantId: string) => {
  // 1. Restaurant validation
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("RESTAURANT_NOT_FOUND");
  }

  // 2. Get OptionGroups with their OptionItems
  return prisma.optionGroup.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      optionItems: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

/**
 * Create a new OptionGroup.
 */
export const createOptionGroup = async (
  restaurantId: string,
  data: {
    name: string;
    selectionType: OptionSelectionType;
    isRequired?: boolean;
    minSelection?: number;
    maxSelection?: number;
    sortOrder?: number;
  },
) => {
  // 1. Restaurant validation
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("RESTAURANT_NOT_FOUND");
  }

  // 2. Determine final constraint values
  const isRequired = data.isRequired ?? false;
  const minSelection = data.minSelection ?? 0;
  const maxSelection = data.maxSelection ?? 1;

  // 3. Validate OptionGroup business rules
  validateOptionGroupConstraints({
    selectionType: data.selectionType,
    isRequired,
    minSelection,
    maxSelection,
  });

  // 4. Duplicate name validation within the restaurant
  const existingOptionGroup = await prisma.optionGroup.findFirst({
    where: {
      restaurantId,
      name: data.name,
    },
  });

  if (existingOptionGroup) {
    throw new Error("OPTION_GROUP_NAME_ALREADY_EXISTS");
  }

  // 5. Determine sortOrder
  let targetSortOrder = data.sortOrder;

  if (targetSortOrder === undefined) {
    const lastOptionGroup = await prisma.optionGroup.findFirst({
      where: {
        restaurantId,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    targetSortOrder = (lastOptionGroup?.sortOrder ?? 0) + 1;
  }

  // 6. Create OptionGroup
  return prisma.optionGroup.create({
    data: {
      restaurantId,
      name: data.name,
      selectionType: data.selectionType,
      isRequired,
      minSelection,
      maxSelection,
      sortOrder: targetSortOrder,
    },
  });
};

/**
 * Update an existing OptionGroup.
 */
export const updateOptionGroup = async (
  restaurantId: string,
  optionGroupId: string,
  data: {
    name?: string;
    selectionType?: OptionSelectionType;
    isRequired?: boolean;
    minSelection?: number;
    maxSelection?: number;
    sortOrder?: number;
  },
) => {
  // 1. OptionGroup + Restaurant ownership validation
  const optionGroup = await prisma.optionGroup.findFirst({
    where: {
      id: optionGroupId,
      restaurantId,
    },
  });

  if (!optionGroup) {
    throw new Error("OPTION_GROUP_NOT_FOUND");
  }

  // 2. Determine the final state after update
  const targetSelectionType = data.selectionType ?? optionGroup.selectionType;

  const targetIsRequired = data.isRequired ?? optionGroup.isRequired;

  const targetMinSelection = data.minSelection ?? optionGroup.minSelection;

  const targetMaxSelection = data.maxSelection ?? optionGroup.maxSelection;

  // 3. Validate the final OptionGroup state
  validateOptionGroupConstraints({
    selectionType: targetSelectionType,
    isRequired: targetIsRequired,
    minSelection: targetMinSelection,
    maxSelection: targetMaxSelection,
  });

  // 4. Duplicate name validation
  const targetName = data.name ?? optionGroup.name;

  if (targetName !== optionGroup.name) {
    const existingOptionGroup = await prisma.optionGroup.findFirst({
      where: {
        restaurantId,
        name: targetName,
        id: {
          not: optionGroupId,
        },
      },
    });

    if (existingOptionGroup) {
      throw new Error("OPTION_GROUP_NAME_ALREADY_EXISTS");
    }
  }

  // 5. Update OptionGroup
  return prisma.optionGroup.update({
    where: {
      id: optionGroupId,
    },
    data: {
      name: data.name,
      selectionType: data.selectionType,
      isRequired: data.isRequired,
      minSelection: data.minSelection,
      maxSelection: data.maxSelection,
      sortOrder: data.sortOrder,
    },
  });
};

/**
 * Delete an existing OptionGroup.
 */
export const deleteOptionGroup = async (
  restaurantId: string,
  optionGroupId: string,
) => {
  // 1. OptionGroup + Restaurant ownership validation
  const optionGroup = await prisma.optionGroup.findFirst({
    where: {
      id: optionGroupId,
      restaurantId,
    },
  });

  if (!optionGroup) {
    throw new Error("OPTION_GROUP_NOT_FOUND");
  }

  // 2. Delete OptionGroup
  return prisma.optionGroup.delete({
    where: {
      id: optionGroupId,
    },
  });
};
