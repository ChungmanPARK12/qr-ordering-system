import { Router } from "express";
import { createCustomerOrder } from "../services/order.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { restaurantId, tableId, customerNote, items } = req.body;

    if (
      typeof restaurantId !== "string" ||
      typeof tableId !== "string" ||
      !Array.isArray(items)
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_ORDER_REQUEST",
        message: "restaurantId, tableId, and items are required.",
      });
    }

    const order = await createCustomerOrder({
      restaurantId,
      tableId,
      customerNote,
      items,
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Failed to create order.";

    return res.status(400).json({
      success: false,
      code: "ORDER_CREATION_FAILED",
      message,
    });
  }
});

export default router;
