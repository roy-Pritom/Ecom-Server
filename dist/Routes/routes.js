"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { userRoutes } from "../Modules/User/user.routes";
const auth_routes_1 = require("../Modules/Auth/auth.routes");
const category_routes_1 = require("../Modules/Category/category.routes");
const product_route_1 = require("../Modules/Product/product.route");
const user_routes_1 = require("../Modules/User/user.routes");
const order_route_1 = require("../Modules/Order/order.route");
const router = express_1.default.Router();
const moduleRoute = [
    {
        path: "/user",
        element: user_routes_1.userRoutes,
    },
    {
        path: "/auth",
        element: auth_routes_1.authRoutes,
    },
    {
        path: "/category",
        element: category_routes_1.categoryRoutes,
    },
    {
        path: "/product",
        element: product_route_1.ProductRoutes,
    },
    {
        path: "/order",
        element: order_route_1.OrderRoutes,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.element));
exports.default = router;
