import express from "express";
// import { userRoutes } from "../Modules/User/user.routes";
import { authRoutes } from "../Modules/Auth/auth.routes";
import { categoryRoutes } from "../Modules/Category/category.routes";
import { ProductRoutes } from "../Modules/Product/product.route";
import { userRoutes } from "../Modules/User/user.routes";
import { OrderRoutes } from "../Modules/Order/order.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/user",
    element: userRoutes,
  },
  {
    path: "/auth",
    element: authRoutes,
  },
  {
    path: "/category",
    element: categoryRoutes,
  },
  {
    path: "/product",
    element: ProductRoutes,
  },
  {
    path: "/order",
    element: OrderRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.element));
export default router;
