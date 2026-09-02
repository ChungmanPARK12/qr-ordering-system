import prisma from "../lib/prisma";

export const getCategoriesByRestaurant = async (restaurantId: string) => {
  return prisma.category.findMany({
    where: {
      restaurantId,
      isVisible: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const getMenuByRestaurant = async (restaurantId: string) => {
  return prisma.category.findMany({
    where: {
      restaurantId,
      isVisible: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      menuItems: {
        where: {
          isVisible: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const getMenuItemDetail = async (
  restaurantId: string,
  menuItemId: string,
) => {
  return prisma.menuItem.findFirst({
    where: {
      id: menuItemId,
      restaurantId,
      isVisible: true,
    },
    include: {
      optionGroups: {
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
      },
    },
  });
};
