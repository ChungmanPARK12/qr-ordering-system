// server/src/services/category.service.ts

import prisma from "../../lib/prisma";

export const getCategoriesByRestaurant = async (restaurantId: string) => {
  return prisma.category.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const createCategory = async (
  restaurantId: string,
  data: {
    name: string;
    description?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
  },
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("RESTAURANT_NOT_FOUND");
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      restaurantId,
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
  }

  return prisma.category.create({
    data: {
      restaurantId,
      name: data.name,
      description: data.description ?? null,
      sortOrder: data.sortOrder ?? 0,
      isVisible: data.isVisible ?? true,
    },
  });
};

export const updateCategory = async (
  restaurantId: string,
  categoryId: string,
  data: {
    name?: string;
    description?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
  },
) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      restaurantId,
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (data.name !== undefined && data.name !== category.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        restaurantId,
        name: data.name,
        id: {
          not: categoryId,
        },
      },
    });

    if (existingCategory) {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    }
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: data.name,
      description: data.description,
      sortOrder: data.sortOrder,
      isVisible: data.isVisible,
    },
  });
};

export const deleteCategory = async (
  restaurantId: string,
  categoryId: string,
) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      restaurantId,
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};
