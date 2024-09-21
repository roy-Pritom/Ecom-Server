import httpStatus from "http-status";
import catchAsync from "../../Utilities/catchAsync";
import sendResponse from "../../Utilities/sendResponse";
import { OrderServices } from "./order.service";
import { productFilterableFields } from "../User/userConstant";
import { optionsPaginationFields } from "../Category/categoryInterface";
import pick from "../../App/Common/Pick";

const createOrder = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const result = await OrderServices.createOrder(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order placed successfully",
        data: result
    })
})

const getOrders = catchAsync(async (req, res) => {
    const filterData = pick(req.query, productFilterableFields);
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await OrderServices.getOrders(filterData,optionsData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order retrieve successfully",
        meta:result.meta,
        data: result.data
    })
})

const getOrderByProductId = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const result = await OrderServices.getOrderByProductId(productId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order retrieve successfully",
        data: result
    })
})
const updateOrderStatus = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const result = await OrderServices.updateOrder(orderId,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status updates successfully",
        data: result
    })
})
const deleteOrder = catchAsync(async (req, res) => {
    const { orderProductId } = req.params;
    const result = await OrderServices.deleteOrder(orderProductId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order deleted successfully",
        data: result
    })
})

export const OrderControllers = {
    createOrder,
    getOrders,
    getOrderByProductId,
    updateOrderStatus,
    deleteOrder
}