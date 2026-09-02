import { Router } from "express";
import {
  getCategoriesByRestaurant,
  getMenuByRestaurant,
  getMenuItemDetail,
} from "../services/menu.service";

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

router.get("/:restaurantId/menu", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menu = await getMenuByRestaurant(restaurantId);

    return res.status(200).json({
      success: true,
      data: menu,
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

router.get("/:restaurantId/menu/:menuItemId", async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;

    const menuItem = await getMenuItemDetail(restaurantId, menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        code: "MENU_ITEM_NOT_FOUND",
        message: "Menu item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: menuItem,
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
