"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const Prisma_1 = __importDefault(require("../../App/Common/Prisma"));
const paginationCalculation_1 = __importDefault(require("../../Utilities/paginationCalculation"));
// import { TOrder } from "./order.interface";
const createOrder = (payload, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Using a transaction to group related operations together
    try {
        const result = yield Prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if product exists
            const product = yield prisma.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new Error("Product does not exist!");
            }
            // Update product with colors and sizes from payload
            // await prisma.product.update({
            //   where: {
            //     id: productId,
            //   },
            //   data: {
            //     colors: payload.colors,
            //     sizes: payload.sizes,
            //   },
            // });
            // Create the order
            const order = yield prisma.order.create({
                data: payload,
            });
            // Create orderProduct data linking order and product
            const orderProductData = {
                orderId: order.id,
                productId,
                quantity: Number(order.quantity),
            };
            // Create orderProduct record
            const orderProduct = yield prisma.orderProduct.create({
                data: orderProductData,
            });
            // Return the created orderProduct
            return orderProduct;
        }));
        // Return the result of the transaction
        return result;
    }
    catch (error) {
        // Handle error (e.g., logging, rethrowing, etc.)
        console.error("Transaction failed:", error);
        throw error; // Re-throwing to propagate the error
    }
});
const getOrders = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const orderSearchingField = ['name'];
    const andCondition = [];
    // Search Term Condition
    if (searchTerm) {
        andCondition.push({
            OR: orderSearchingField.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    andCondition.push({
        isDeleted: false,
    });
    // console.log(maxPrice,minPrice);
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.orderProduct.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
        include: {
            order: true,
            product: true
        }
    });
    const total = yield Prisma_1.default.orderProduct.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getOrderByProductId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.orderProduct.findMany({
        where: {
            productId: id
        },
        include: {
            order: true,
            product: true
        }
    });
    return result;
});
const updateOrder = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.order.update({
        where: {
            id: orderId
        },
        data: {
            status: payload.status
        }
    });
    return result;
});
const deleteOrder = (orderProductId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.orderProduct.delete({
        where: {
            id: orderProductId
        }
    });
    return result;
});
exports.OrderServices = {
    createOrder,
    getOrders,
    getOrderByProductId,
    updateOrder,
    deleteOrder
};
