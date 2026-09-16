import prisma from "../../lib/prisma";

/**
 * Get all OptionItems belonging to an OptionGroup.
 */
export const getOptionItemsByGroup = async (
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

  // 2. Get OptionItems
  return prisma.optionItem.findMany({
    where: {
      optionGroupId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};

/**
 * Create a new OptionItem.
 */
export const createOptionItem = async (
  restaurantId: string,
  optionGroupId: string,
  data: {
    name: string;
    additionalPrice?: number;
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

  // 2. Duplicate name validation within the OptionGroup
  const existingOptionItem = await prisma.optionItem.findFirst({
    where: {
      optionGroupId,
      name: data.name,
    },
  });

  if (existingOptionItem) {
    throw new Error("OPTION_ITEM_NAME_ALREADY_EXISTS");
  }

  // 3. Determine sortOrder
  let targetSortOrder = data.sortOrder;

  if (targetSortOrder === undefined) {
    const lastOptionItem = await prisma.optionItem.findFirst({
      where: {
        optionGroupId,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    targetSortOrder = (lastOptionItem?.sortOrder ?? 0) + 1;
  }

  // 4. Create OptionItem
  return prisma.optionItem.create({
    data: {
      optionGroupId,
      name: data.name,
      additionalPrice: data.additionalPrice ?? 0,
      sortOrder: targetSortOrder,
    },
  });
};

/**
 * Update an existing OptionItem.
 */
export const updateOptionItem = async (
  restaurantId: string,
  optionGroupId: string,
  optionItemId: string,
  data: {
    name?: string;
    additionalPrice?: number;
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

  // 2. OptionItem + OptionGroup ownership validation
  const optionItem = await prisma.optionItem.findFirst({
    where: {
      id: optionItemId,
      optionGroupId,
    },
  });

  if (!optionItem) {
    throw new Error("OPTION_ITEM_NOT_FOUND");
  }

  // 3. Duplicate name validation within the OptionGroup
  const targetName = data.name ?? optionItem.name;

  if (targetName !== optionItem.name) {
    const existingOptionItem = await prisma.optionItem.findFirst({
      where: {
        optionGroupId,
        name: targetName,
        id: {
          not: optionItemId,
        },
      },
    });

    if (existingOptionItem) {
      throw new Error("OPTION_ITEM_NAME_ALREADY_EXISTS");
    }
  }

  // 4. Update OptionItem
  return prisma.optionItem.update({
    where: {
      id: optionItemId,
    },
    data: {
      name: data.name,
      additionalPrice: data.additionalPrice,
      sortOrder: data.sortOrder,
    },
  });
};

/**
 * Delete an existing OptionItem.
 */
export const deleteOptionItem = async (
  restaurantId: string,
  optionGroupId: string,
  optionItemId: string,
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

  // 2. OptionItem + OptionGroup ownership validation
  const optionItem = await prisma.optionItem.findFirst({
    where: {
      id: optionItemId,
      optionGroupId,
    },
  });

  if (!optionItem) {
    throw new Error("OPTION_ITEM_NOT_FOUND");
  }

  // 3. Delete OptionItem
  return prisma.optionItem.delete({
    where: {
      id: optionItemId,
    },
  });
};

