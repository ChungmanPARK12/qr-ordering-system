import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import restaurantRoutes from "./routes/restaurant.routes";
import qrRoutes from "./routes/qr.routes";
import menuRoutes from "./routes/menu.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/restaurants", menuRoutes);
app.use("/api/orders", orderRoutes);

export default app;
