// server/src/routes/category.routes.ts

import { Router } from "express";
import {
  createCategory,
  getCategoriesByRestaurant,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

const router = Router();

router.get("/:restaurantId/categories", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const categories = await getCategoriesByRestaurant(restaurantId);

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    });
  }
});

router.post("/:restaurantId/categories", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, sortOrder, isVisible } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CATEGORY_NAME",
        message: "Category name is required.",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CATEGORY_DESCRIPTION",
        message: "Category description must be a string.",
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

    const category = await createCategory(restaurantId, {
      name: name.trim(),
      description:
        typeof description === "string" ? description.trim() || null : null,
      sortOrder,
      isVisible,
    });

    return res.status(201).json({
      success: true,
      data: category,
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

      if (error.message === "CATEGORY_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          code: "CATEGORY_NAME_ALREADY_EXISTS",
          message: "Category name already exists.",
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

router.patch("/:restaurantId/categories/:categoryId", async (req, res) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const { name, description, sortOrder, isVisible } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          code: "INVALID_CATEGORY_NAME",
          message: "Category name must be a non-empty string.",
        });
      }
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_CATEGORY_DESCRIPTION",
        message: "Category description must be a string.",
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

    const category = await updateCategory(restaurantId, categoryId, {
      name: typeof name === "string" ? name.trim() : undefined,
      description:
        typeof description === "string"
          ? description.trim() || null
          : description,
      sortOrder,
      isVisible,
    });

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found.",
        });
      }

      if (error.message === "CATEGORY_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          code: "CATEGORY_NAME_ALREADY_EXISTS",
          message: "Category name already exists.",
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

router.delete("/:restaurantId/categories/:categoryId", async (req, res) => {
  try {
    const { restaurantId, categoryId } = req.params;

    const category = await deleteCategory(restaurantId, categoryId);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          code: "CATEGORY_NOT_FOUND",
          message: "Category not found.",
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

export default router;
