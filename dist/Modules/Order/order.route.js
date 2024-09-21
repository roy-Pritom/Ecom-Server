"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post('/create/:productId', order_controller_1.OrderControllers.createOrder);
router.get('/', order_controller_1.OrderControllers.getOrders);
router.get('/:productId', order_controller_1.OrderControllers.getOrderByProductId);
router.patch('/:orderId', order_controller_1.OrderControllers.updateOrderStatus);
router.delete('/:orderProductId', order_controller_1.OrderControllers.deleteOrder);
exports.OrderRoutes = router;
