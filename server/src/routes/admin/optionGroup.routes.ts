import { Router } from "express";
import {
  createOptionGroup,
  deleteOptionGroup,
  getOptionGroupsByRestaurant,
  updateOptionGroup,
} from "../../services/admin/optionGroup.service";

const router = Router();

router.get("/:restaurantId/option-groups", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const optionGroups = await getOptionGroupsByRestaurant(restaurantId);

    return res.status(200).json({
      success: true,
      data: optionGroups,
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

router.post("/:restaurantId/option-groups", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const {
      name,
      selectionType,
      isRequired,
      minSelection,
      maxSelection,
      sortOrder,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        code: "INVALID_NAME",
        message: "Name is required.",
      });
    }

    if (selectionType !== "SINGLE" && selectionType !== "MULTIPLE") {
      return res.status(400).json({
        success: false,
        code: "INVALID_SELECTION_TYPE",
        message: "Selection type must be SINGLE or MULTIPLE.",
      });
    }

    if (isRequired !== undefined && typeof isRequired !== "boolean") {
      return res.status(400).json({
        success: false,
        code: "INVALID_REQUIRED_STATUS",
        message: "Required status must be a boolean.",
      });
    }

    if (
      minSelection !== undefined &&
      (!Number.isInteger(minSelection) || minSelection < 0)
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_MIN_SELECTION",
        message: "Minimum selection must be a non-negative integer.",
      });
    }

    if (
      maxSelection !== undefined &&
      (!Number.isInteger(maxSelection) || maxSelection < 1)
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_MAX_SELECTION",
        message: "Maximum selection must be a positive integer.",
      });
    }

    if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_SORT_ORDER",
        message: "Sort order must be an integer.",
      });
    }

    const optionGroup = await createOptionGroup(restaurantId, {
      name: name.trim(),
      selectionType,
      isRequired,
      minSelection,
      maxSelection,
      sortOrder,
    });

    return res.status(201).json({
      success: true,
      data: optionGroup,
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

      if (error.message === "INVALID_OPTION_GROUP_CONSTRAINTS") {
        return res.status(400).json({
          success: false,
          code: "INVALID_OPTION_GROUP_CONSTRAINTS",
          message: "Option group selection constraints are invalid.",
        });
      }

      if (error.message === "OPTION_GROUP_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          code: "OPTION_GROUP_NAME_ALREADY_EXISTS",
          message: "An option group with this name already exists.",
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

router.patch(
  "/:restaurantId/option-groups/:optionGroupId",
  async (req, res) => {
    try {
      const { restaurantId, optionGroupId } = req.params;
      const {
        name,
        selectionType,
        isRequired,
        minSelection,
        maxSelection,
        sortOrder,
      } = req.body;

      if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        return res.status(400).json({
          success: false,
          code: "INVALID_NAME",
          message: "Name must be a non-empty string.",
        });
      }

      if (
        selectionType !== undefined &&
        selectionType !== "SINGLE" &&
        selectionType !== "MULTIPLE"
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_SELECTION_TYPE",
          message: "Selection type must be SINGLE or MULTIPLE.",
        });
      }

      if (isRequired !== undefined && typeof isRequired !== "boolean") {
        return res.status(400).json({
          success: false,
          code: "INVALID_REQUIRED_STATUS",
          message: "Required status must be a boolean.",
        });
      }

      if (
        minSelection !== undefined &&
        (!Number.isInteger(minSelection) || minSelection < 0)
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_MIN_SELECTION",
          message: "Minimum selection must be a non-negative integer.",
        });
      }

      if (
        maxSelection !== undefined &&
        (!Number.isInteger(maxSelection) || maxSelection < 1)
      ) {
        return res.status(400).json({
          success: false,
          code: "INVALID_MAX_SELECTION",
          message: "Maximum selection must be a positive integer.",
        });
      }

      if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
        return res.status(400).json({
          success: false,
          code: "INVALID_SORT_ORDER",
          message: "Sort order must be an integer.",
        });
      }

      const optionGroup = await updateOptionGroup(restaurantId, optionGroupId, {
        name: typeof name === "string" ? name.trim() : undefined,
        selectionType,
        isRequired,
        minSelection,
        maxSelection,
        sortOrder,
      });

      return res.status(200).json({
        success: true,
        data: optionGroup,
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

        if (error.message === "INVALID_OPTION_GROUP_CONSTRAINTS") {
          return res.status(400).json({
            success: false,
            code: "INVALID_OPTION_GROUP_CONSTRAINTS",
            message: "Option group selection constraints are invalid.",
          });
        }

        if (error.message === "OPTION_GROUP_NAME_ALREADY_EXISTS") {
          return res.status(409).json({
            success: false,
            code: "OPTION_GROUP_NAME_ALREADY_EXISTS",
            message: "An option group with this name already exists.",
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
  "/:restaurantId/option-groups/:optionGroupId",
  async (req, res) => {
    try {
      const { restaurantId, optionGroupId } = req.params;

      const optionGroup = await deleteOptionGroup(restaurantId, optionGroupId);

      return res.status(200).json({
        success: true,
        data: optionGroup,
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

export default router;
