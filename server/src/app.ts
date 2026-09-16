import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import restaurantRoutes from "./routes/customer/restaurant.routes";
import qrRoutes from "./routes/customer/qr.routes";
import menuRoutes from "./routes/customer/menu.routes";
import orderRoutes from "./routes/customer/order.routes";

import categoryRoutes from "./routes/admin/category.routes";
import menuItemRoutes from "./routes/admin/menuItem.routes";
import optionGroupRoutes from "./routes/admin/optionGroup.routes";
import optionItemRoutes from "./routes/admin/optionItem.routes";

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

app.use("/api/admin/restaurants", categoryRoutes);
app.use("/api/admin/restaurants", menuItemRoutes);
app.use("/api/admin/restaurants", optionGroupRoutes);
app.use("/api/admin/restaurants", optionItemRoutes);

export default app;
