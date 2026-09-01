import { Router } from "express";
import {
  getRestaurantById,
  getTableById,
} from "../services/restaurant.service";

const router = Router();

router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await getRestaurantById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        code: "RESTAURANT_NOT_FOUND",
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
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

router.get("/:restaurantId/tables/:tableId", async (req, res) => {
  try {
    const { restaurantId, tableId } = req.params;

    const table = await getTableById(restaurantId, tableId);

    if (!table) {
      return res.status(404).json({
        success: false,
        code: "TABLE_NOT_FOUND",
        message: "Table not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: table,
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

export default router;
