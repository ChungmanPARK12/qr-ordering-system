import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  setMenuItemOptionGroups,
} from "../../services/admin/menuItem.service";

const router = Router();

router.get("/:restaurantId/menu-items", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = await getMenuItemsByRestaurant(restaurantId);

    return res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "RESTAURANT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "RESTAURANT_NOT_FOUND",
          message: "Restaurant not found.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    });
  }
});

router.post("/:restaurantId/menu-items", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const {
      name,
      description,
      price,
      imageUrl,
      isVisible,
      isSoldOut,
      categoryId,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        code: "INVALID_NAME",
        message: "Name is required.",
      });
    }

    if (typeof categoryId !== "string" || !categoryId.trim()) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CATEGORY_ID",
        message: "Category ID is required.",
      });
    }

    if (!Number.isInteger(price) || price < 0) {
      return res.status(400).json({
        success: false,
        code: "INVALID_PRICE",
        message: "Price must be a non-negative integer.",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_DESCRIPTION",
        message: "Description must be a string or null.",
      });
    }

    if (
      imageUrl !== undefined &&
      imageUrl !== null &&
      typeof imageUrl !== "string"
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_IMAGE_URL",
        message: "Image URL must be a string or null.",
      });
    }

    if (isVisible !== undefined && typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        code: "INVALID_VISIBILITY",
        message: "Visibility must be a boolean.",
      });
    }

    if (isSoldOut !== undefined && typeof isSoldOut !== "boolean") {
      return res.status(400).json({
        success: false,
        code: "INVALID_SOLD_OUT_STATUS",
        message: "Sold-out status must be a boolean.",
      });
    }

    const menuItem = await createMenuItem(restaurantId, {
      name: name.trim(),
      description,
      price,
      imageUrl,
      isVisible,
      isSoldOut,
      categoryId,
    });

    return res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "RESTAURANT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "RESTAURANT_NOT_FOUND",
          message: "Restaurant not found.",
        });
      }

      if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found.",
        });
      }

      if (error.message === "MENU_ITEM_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          code: "MENU_ITEM_NAME_ALREADY_EXISTS",
          message: "A menu item with this name already exists in the category.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    });
  }
});

router.patch("/:restaurantId/menu-items/:menuItemId", async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const {
      name,
      description,
      price,
      imageUrl,
      sortOrder,
      isVisible,
      isSoldOut,
      categoryId,
    } = req.body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({
        success: false,
        code: "INVALID_NAME",
        message: "Name must be a non-empty string.",
      });
    }

    if (
      categoryId !== undefined &&
      (typeof categoryId !== "string" || !categoryId.trim())
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CATEGORY_ID",
        message: "Category ID must be a non-empty string.",
      });
    }

    if (price !== undefined && (!Number.isInteger(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_PRICE",
        message: "Price must be a non-negative integer.",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_DESCRIPTION",
        message: "Description must be a string or null.",
      });
    }

    if (
      imageUrl !== undefined &&
      imageUrl !== null &&
      typeof imageUrl !== "string"
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_IMAGE_URL",
        message: "Image URL must be a string or null.",
      });
    }

    if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_SORT_ORDER",
        message: "Sort order must be an integer.",
      });
    }

    if (isVisible !== undefined && typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        code: "INVALID_VISIBILITY",
        message: "Visibility must be a boolean.",
      });
    }

    if (isSoldOut !== undefined && typeof isSoldOut !== "boolean") {
      return res.status(400).json({
        success: false,
        code: "INVALID_SOLD_OUT_STATUS",
        message: "Sold-out status must be a boolean.",
      });
    }

    const menuItem = await updateMenuItem(restaurantId, menuItemId, {
      name: typeof name === "string" ? name.trim() : undefined,
      description,
      price,
      imageUrl,
      sortOrder,
      isVisible,
      isSoldOut,
      categoryId,
    });

    return res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "MENU_ITEM_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "MENU_ITEM_NOT_FOUND",
          message: "Menu item not found.",
        });
      }

      if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found.",
        });
      }

      if (error.message === "MENU_ITEM_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          code: "MENU_ITEM_NAME_ALREADY_EXISTS",
          message: "A menu item with this name already exists in the category.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    });
  }
});

router.delete("/:restaurantId/menu-items/:menuItemId", async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;

    const menuItem = await deleteMenuItem(restaurantId, menuItemId);

    return res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "MENU_ITEM_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "MENU_ITEM_NOT_FOUND",
          message: "Menu item not found.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    });
  }
});

router.put(
  "/:restaurantId/menu-items/:menuItemId/option-groups",
  async (req, res) => {
    try {
      const { restaurantId, menuItemId } = req.params;
      const { optionGroupIds } = req.body;

      // 1. Request shape validation
      if (
        !Array.isArray(optionGroupIds) ||
        !optionGroupIds.every(
          (id) => typeof id === "string" && id.trim().length > 0,
        )
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_OPTION_GROUP_IDS",
          message: "Option group IDs must be an array of non-empty strings.",
        });
      }

      // 2. Update relationships
      const menuItem = await setMenuItemOptionGroups(
        restaurantId,
        menuItemId,
        optionGroupIds,
      );

      return res.status(200).json({
        success: true,
        data: menuItem,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message === "MENU_ITEM_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            code: "MENU_ITEM_NOT_FOUND",
            message: "Menu item not found.",
          });
        }

        if (error.message === "INVALID_OPTION_GROUPS") {
          return res.status(400).json({
            success: false,
            code: "INVALID_OPTION_GROUPS",
            message:
              "One or more option groups are invalid for this restaurant.",
          });
        }
      }

      return res.status(500).json({
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      });
    }
  },
);

export default router;
