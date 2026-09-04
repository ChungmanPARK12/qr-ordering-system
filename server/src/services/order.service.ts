import prisma from "../lib/prisma";

type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
  optionItemIds: string[];
};

type CreateOrderInput = {
  restaurantId: string;
  tableId: string;
  customerNote?: string;
  items: CreateOrderItemInput[];
};

type SelectedOptionSnapshot = {
  optionGroupId: string;
  optionGroupName: string;
  optionItemId: string;
  optionItemName: string;
  additionalPrice: number;
};

type PreparedOrderItem = {
  menuItemId: string;
  menuNameSnapshot: string;
  basePriceSnapshot: number;
  unitPriceSnapshot: number;
  selectedOptions: SelectedOptionSnapshot[];
  quantity: number;
  lineTotal: number;
};

const generateOrderNumber = () => {
  return `ORDER-${Date.now()}`;
};

export const createCustomerOrder = async (input: CreateOrderInput) => {
  const { restaurantId, tableId, customerNote, items } = input;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  // -----------------------------
  // Validate restaurant
  // -----------------------------
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }

  if (!restaurant.isActive) {
    throw new Error("Restaurant is currently unavailable.");
  }

  // -----------------------------
  // Validate table
  // -----------------------------
  const table = await prisma.restaurantTable.findUnique({
    where: {
      id: tableId,
    },
  });

  if (!table) {
    throw new Error("Table not found.");
  }

  if (table.restaurantId !== restaurantId) {
    throw new Error("Table does not belong to this restaurant.");
  }

  if (!table.isActive || table.status !== "ACTIVE") {
    throw new Error("Table is currently unavailable.");
  }

  // -----------------------------
  // Prepare order items
  // -----------------------------
  const preparedItems: PreparedOrderItem[] = [];

  for (const item of items) {
    // -----------------------------
    // Validate order item input
    // -----------------------------
    if (typeof item.menuItemId !== "string") {
      throw new Error("menuItemId must be a string.");
    }

    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new Error("Item quantity must be a positive integer.");
    }

    if (
      !Array.isArray(item.optionItemIds) ||
      !item.optionItemIds.every(
        (optionItemId) => typeof optionItemId === "string",
      )
    ) {
      throw new Error("optionItemIds must be an array of strings.");
    }

    // -----------------------------
    // Prevent duplicate options
    // -----------------------------
    const uniqueOptionItemIds = new Set(item.optionItemIds);

    if (uniqueOptionItemIds.size !== item.optionItemIds.length) {
      throw new Error("Duplicate option items are not allowed.");
    }

    // -----------------------------
    // Validate menu item
    // -----------------------------
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: item.menuItemId,
        restaurantId,
        isVisible: true,
      },
      include: {
        optionGroups: {
          include: {
            optionItems: true,
          },
        },
      },
    });

    if (!menuItem) {
      throw new Error(`Menu item not found: ${item.menuItemId}`);
    }

    if (menuItem.isSoldOut) {
      throw new Error(`${menuItem.name} is currently sold out.`);
    }

    // -----------------------------
    // Validate selected option IDs
    // -----------------------------
    const availableOptionItems = menuItem.optionGroups.flatMap((group) =>
      group.optionItems.map((optionItem) => ({
        ...optionItem,
        optionGroupId: group.id,
        optionGroupName: group.name,
      })),
    );

    const selectedOptionItems = item.optionItemIds.map((optionItemId) => {
      const optionItem = availableOptionItems.find(
        (availableItem) => availableItem.id === optionItemId,
      );

      if (!optionItem) {
        throw new Error(`Invalid option item: ${optionItemId}`);
      }

      return optionItem;
    });

    // -----------------------------
    // Validate option group rules
    // -----------------------------
    for (const group of menuItem.optionGroups) {
      const selectedCount = selectedOptionItems.filter(
        (optionItem) => optionItem.optionGroupId === group.id,
      ).length;

      if (selectedCount < group.minSelection) {
        throw new Error(
          `${group.name} requires at least ${group.minSelection} selection(s).`,
        );
      }

      if (selectedCount > group.maxSelection) {
        throw new Error(
          `${group.name} allows up to ${group.maxSelection} selection(s).`,
        );
      }
    }

    // -----------------------------
    // Calculate prices
    // -----------------------------
    const optionsTotal = selectedOptionItems.reduce(
      (total, optionItem) => total + optionItem.additionalPrice,
      0,
    );

    const basePriceSnapshot = menuItem.price;

    const unitPriceSnapshot = basePriceSnapshot + optionsTotal;

    const lineTotal = unitPriceSnapshot * item.quantity;

    const selectedOptionsSnapshot = selectedOptionItems.map((optionItem) => ({
      optionGroupId: optionItem.optionGroupId,
      optionGroupName: optionItem.optionGroupName,
      optionItemId: optionItem.id,
      optionItemName: optionItem.name,
      additionalPrice: optionItem.additionalPrice,
    }));

    preparedItems.push({
      menuItemId: menuItem.id,
      menuNameSnapshot: menuItem.name,
      basePriceSnapshot,
      unitPriceSnapshot,
      selectedOptions: selectedOptionsSnapshot,
      quantity: item.quantity,
      lineTotal,
    });
  }

  // -----------------------------
  // Calculate order total
  // -----------------------------
  const subtotal = preparedItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  const discountAmount = 0;

  const totalAmount = subtotal - discountAmount;

  const orderNumber = generateOrderNumber();

  // -----------------------------
  // Create order transaction
  // -----------------------------
  const createdOrder = await prisma.$transaction(async (tx) => {
    return tx.customerOrder.create({
      data: {
        orderNumber,
        restaurantId,
        tableId,
        customerNote,
        subtotal,
        discountAmount,
        totalAmount,

        items: {
          create: preparedItems.map((item) => ({
            menuItemId: item.menuItemId,
            menuNameSnapshot: item.menuNameSnapshot,
            basePriceSnapshot: item.basePriceSnapshot,
            unitPriceSnapshot: item.unitPriceSnapshot,
            selectedOptions: item.selectedOptions,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
        },
      },

      include: {
        restaurant: true,
        table: true,
        items: true,
      },
    });
  });

  return createdOrder;
};
