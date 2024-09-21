import express from 'express';
import { OrderControllers } from './order.controller';

const router=express.Router();


router.post('/create',OrderControllers.createOrder);
router.get('/',OrderControllers.getOrders);
router.get('/:productId',OrderControllers.getOrderByProductId);
router.patch('/:orderId',OrderControllers.updateOrderStatus);
router.delete('/:orderProductId',OrderControllers.deleteOrder);

export const OrderRoutes=router;