import prisma from "../lib/prisma";

export const getRestaurantById = async (restaurantId: string) => {
  return prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });
};

export const getTableById = async (restaurantId: string, tableId: string) => {
  return prisma.restaurantTable.findFirst({
    where: {
      id: tableId,
      restaurantId,
    },
  });
};

export const validateQrEntry = async (
  restaurantId: string,
  tableId: string,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    return {
      success: false,
      status: 404,
      code: "RESTAURANT_NOT_FOUND",
      message: "Restaurant not found.",
    };
  }

  if (!restaurant.isActive) {
    return {
      success: false,
      status: 403,
      code: "RESTAURANT_INACTIVE",
      message: "Restaurant is currently unavailable.",
    };
  }

  const table = await prisma.restaurantTable.findUnique({
    where: {
      id: tableId,
    },
  });

  if (!table) {
    return {
      success: false,
      status: 404,
      code: "TABLE_NOT_FOUND",
      message: "Table not found.",
    };
  }

  if (table.restaurantId !== restaurantId) {
    return {
      success: false,
      status: 400,
      code: "TABLE_RESTAURANT_MISMATCH",
      message: "Table does not belong to this restaurant.",
    };
  }

  if (!table.isActive || table.status !== "ACTIVE") {
    return {
      success: false,
      status: 403,
      code: "TABLE_INACTIVE",
      message: "Table is currently unavailable.",
    };
  }

  return {
    success: true,
    status: 200,
    data: {
      restaurant,
      table,
    },
  };
};
