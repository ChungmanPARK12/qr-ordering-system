import { Router } from "express";
import { validateQrEntry } from "../services/restaurant.service";

const router = Router();

router.get("/validate", async (req, res) => {
  try {
    const { restaurantId, tableId } = req.query;

    if (typeof restaurantId !== "string" || typeof tableId !== "string") {
      return res.status(400).json({
        success: false,
        code: "INVALID_QR_PARAMS",
        message: "restaurantId and tableId are required.",
      });
    }

    const result = await validateQrEntry(restaurantId, tableId);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        code: result.code,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
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
