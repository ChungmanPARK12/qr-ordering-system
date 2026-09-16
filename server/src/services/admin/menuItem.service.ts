import prisma from "../../lib/prisma";

export const getMenuItemsByRestaurant = async (restaurantId: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("RESTAURANT_NOT_FOUND");
  }

  return prisma.menuItem.findMany({
    where: {
      restaurantId,
    },
    orderBy: [
      {
        categoryId: "asc",
      },
      {
        sortOrder: "asc",
      },
    ],
  });
};

export const createMenuItem = async (
  restaurantId: string,
  data: {
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
    isSoldOut?: boolean;
    categoryId: string;
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

  // 2. Category + Restaurant relationship validation
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      restaurantId,
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  // 3. Duplicate menu name validation within the category
  const existingMenuItem = await prisma.menuItem.findFirst({
    where: {
      categoryId: data.categoryId,
      name: data.name,
    },
  });

  if (existingMenuItem) {
    throw new Error("MENU_ITEM_NAME_ALREADY_EXISTS");
  }

  // 4. Determine sortOrder
  let targetSortOrder = data.sortOrder;

  if (targetSortOrder === undefined) {
    const lastMenuItem = await prisma.menuItem.findFirst({
      where: {
        restaurantId,
        categoryId: data.categoryId,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    targetSortOrder = (lastMenuItem?.sortOrder ?? 0) + 1;
  }

  // 5. Create MenuItem
  return prisma.menuItem.create({
    data: {
      restaurantId,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      imageUrl: data.imageUrl ?? null,
      sortOrder: targetSortOrder,
      isVisible: data.isVisible ?? true,
      isSoldOut: data.isSoldOut ?? false,
    },
  });
};

export const updateMenuItem = async (
  restaurantId: string,
  menuItemId: string,
  data: {
    name?: string;
    description?: string | null;
    price?: number;
    imageUrl?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
    isSoldOut?: boolean;
    categoryId?: string;
  },
) => {
  // 1. MenuItem + Restaurant validation
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      restaurantId,
    },
  });

  if (!menuItem) {
    throw new Error("MENU_ITEM_NOT_FOUND");
  }

  // 2. Determine the category after update
  const targetCategoryId = data.categoryId ?? menuItem.categoryId;

  // 3. Category + Restaurant relationship validation
  if (data.categoryId !== undefined) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        restaurantId,
      },
    });

    if (!category) {
      throw new Error("CATEGORY_NOT_FOUND");
    }
  }

  // 4. Recalculate sortOrder when moving to another category
  let targetSortOrder = data.sortOrder;

  if (
    data.categoryId !== undefined &&
    data.categoryId !== menuItem.categoryId &&
    data.sortOrder === undefined
  ) {
    const lastMenuItem = await prisma.menuItem.findFirst({
      where: {
        restaurantId,
        categoryId: data.categoryId,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    targetSortOrder = (lastMenuItem?.sortOrder ?? 0) + 1;
  }

  // 5. Duplicate menu name validation
  const targetName = data.name ?? menuItem.name;

  if (
    targetName !== menuItem.name ||
    targetCategoryId !== menuItem.categoryId
  ) {
    const existingMenuItem = await prisma.menuItem.findFirst({
      where: {
        categoryId: targetCategoryId,
        name: targetName,
        id: {
          not: menuItemId,
        },
      },
    });

    if (existingMenuItem) {
      throw new Error("MENU_ITEM_NAME_ALREADY_EXISTS");
    }
  }

  // 6. Update MenuItem
  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      sortOrder: targetSortOrder,
      isVisible: data.isVisible,
      isSoldOut: data.isSoldOut,
      categoryId: data.categoryId,
    },
  });
};

export const deleteMenuItem = async (
  restaurantId: string,
  menuItemId: string,
) => {
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      restaurantId,
    },
  });

  if (!menuItem) {
    throw new Error("MENU_ITEM_NOT_FOUND");
  }

  return prisma.menuItem.delete({
    where: {
      id: menuItemId,
    },
  });
};

export const setMenuItemOptionGroups = async (
  restaurantId: string,
  menuItemId: string,
  optionGroupIds: string[],
) => {
  // 1. MenuItem + Restaurant ownership validation
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      restaurantId,
    },
  });

  if (!menuItem) {
    throw new Error("MENU_ITEM_NOT_FOUND");
  }

  // 2. Validate all OptionGroups belong to the same Restaurant
  const uniqueOptionGroupIds = [...new Set(optionGroupIds)];

  const optionGroups = await prisma.optionGroup.findMany({
    where: {
      id: {
        in: uniqueOptionGroupIds,
      },
      restaurantId,
    },
  });

  if (optionGroups.length !== uniqueOptionGroupIds.length) {
    throw new Error("INVALID_OPTION_GROUPS");
  }

  // 3. Replace the MenuItem's OptionGroup relationships
  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },
    data: {
      optionGroups: {
        set: uniqueOptionGroupIds.map((id) => ({ id })),
      },
    },
    include: {
      optionGroups: {
        include: {
          optionItems: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });
};
