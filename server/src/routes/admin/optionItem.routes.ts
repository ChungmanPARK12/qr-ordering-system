import { Router } from "express";
import {
  createOptionItem,
  deleteOptionItem,
  getOptionItemsByGroup,
  updateOptionItem,
} from "../../services/admin/optionItem.service";

const router = Router();

router.get(
  "/:restaurantId/option-groups/:optionGroupId/items",
  async (req, res) => {
    try {
      const { restaurantId, optionGroupId } = req.params;

      const optionItems = await getOptionItemsByGroup(
        restaurantId,
        optionGroupId,
      );

      return res.status(200).json({
        success: true,
        data: optionItems,
      });
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error &&
        error.message === "OPTION_GROUP_NOT_FOUND"
      ) {
        return res.status(404).json({
          success: false,
          code: "OPTION_GROUP_NOT_FOUND",
          message: "Option group not found.",
        });
      }

      return res.status(500).json({
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      });
    }
  },
);

router.post(
  "/:restaurantId/option-groups/:optionGroupId/items",
  async (req, res) => {
    try {
      const { restaurantId, optionGroupId } = req.params;
      const { name, additionalPrice, sortOrder } = req.body;

      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          code: "INVALID_NAME",
          message: "Name is required.",
        });
      }

      if (
        additionalPrice !== undefined &&
        (!Number.isInteger(additionalPrice) || additionalPrice < 0)
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_ADDITIONAL_PRICE",
          message: "Additional price must be a non-negative integer.",
        });
      }

      if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
        return res.status(400).json({
          success: false,
          code: "INVALID_SORT_ORDER",
          message: "Sort order must be an integer.",
        });
      }

      const optionItem = await createOptionItem(
        restaurantId,
        optionGroupId,
        {
          name: name.trim(),
          additionalPrice,
          sortOrder,
        },
      );

      return res.status(201).json({
        success: true,
        data: optionItem,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message === "OPTION_GROUP_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            code: "OPTION_GROUP_NOT_FOUND",
            message: "Option group not found.",
          });
        }

        if (error.message === "OPTION_ITEM_NAME_ALREADY_EXISTS") {
          return res.status(409).json({
            success: false,
            code: "OPTION_ITEM_NAME_ALREADY_EXISTS",
            message: "An option item with this name already exists.",
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

router.patch(
  "/:restaurantId/option-groups/:optionGroupId/items/:optionItemId",
  async (req, res) => {
    try {
      const { restaurantId, optionGroupId, optionItemId } = req.params;
      const { name, additionalPrice, sortOrder } = req.body;

      if (
        name !== undefined &&
        (typeof name !== "string" || !name.trim())
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_NAME",
          message: "Name must be a non-empty string.",
        });
      }

      if (
        additionalPrice !== undefined &&
        (!Number.isInteger(additionalPrice) || additionalPrice < 0)
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_ADDITIONAL_PRICE",
          message: "Additional price must be a non-negative integer.",
        });
      }

      if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
        return res.status(400).json({
          success: false,
          code: "INVALID_SORT_ORDER",
          message: "Sort order must be an integer.",
        });
      }

      const optionItem = await updateOptionItem(
        restaurantId,
        optionGroupId,
        optionItemId,
        {
          name: typeof name === "string" ? name.trim() : undefined,
          additionalPrice,
          sortOrder,
        },
      );

      return res.status(200).json({
        success: true,
        data: optionItem,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message === "OPTION_GROUP_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            code: "OPTION_GROUP_NOT_FOUND",
            message: "Option group not found.",
          });
        }

        if (error.message === "OPTION_ITEM_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            code: "OPTION_ITEM_NOT_FOUND",
            message: "Option item not found.",
          });
        }

        if (error.message === "OPTION_ITEM_NAME_ALREADY_EXISTS") {
          return res.status(409).json({
            success: false,
            code: "OPTION_ITEM_NAME_ALREADY_EXISTS",
            message: "An option item with this name already exists.",
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

router.delete(
  "/:restaurantId/option-groups/:optionGroupId/items/:optionItemId",
  async (req, res) => {
    try {
      const { restaurantId, optionGroupId, optionItemId } = req.params;

      const optionItem = await deleteOptionItem(
        restaurantId,
        optionGroupId,
        optionItemId,
      );

      return res.status(200).json({
        success: true,
        data: optionItem,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message === "OPTION_GROUP_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            code: "OPTION_GROUP_NOT_FOUND",
            message: "Option group not found.",
          });
        }

        if (error.message === "OPTION_ITEM_NOT_FOUND") {
          return res.status(404).json({
            success: false,
            code: "OPTION_ITEM_NOT_FOUND",
            message: "Option item not found.",
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