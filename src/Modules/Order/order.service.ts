import {  Prisma } from "@prisma/client";
import prisma from "../../App/Common/Prisma";
// import { TProduct } from "../Product/product.interface";
// import { TOrder } from "./order.interface";
import { IPaginationOptions } from "../User/userInterface";
import paginationCalculation from "../../Utilities/paginationCalculation";
// import { TOrder } from "./order.interface";
const createOrder= async (payloads: any[]) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Iterate over the array of payloads and create orders
      const orderResults = [];

      for (const payload of payloads) {
        // Check if the product exists for each order
        const product = await prisma.product.findUnique({
          where: { id: payload.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${payload.productId} does not exist!`);
        }

        // Create the order
        const order = await prisma.order.create({
          data: {
            name  :payload?.name,
  address  :payload?.address,
  contact  :payload?.contact,
  note    :payload?.note,
  slip     :payload?.slip,
  sizes    :payload?.sizes,
  colors    :payload?.colors,
  quantity   :payload?.quantity,
  totalPrice :parseFloat(payload?.totalPrice)
          },
        });

        // Create the orderProduct data
        const orderProductData = {
          orderId: order.id,
          productId: payload.productId,
          quantity: Number(payload.quantity),
        };

        // Create orderProduct record
        const orderProduct = await prisma.orderProduct.create({
          data: orderProductData,
        });

        // Collect the results for each order
        orderResults.push({ order, orderProduct });
      }

      // Return all the created orders
      return orderResults;
    });

    // Return the result of the transaction
    return result;
  } catch (error) {
    // Handle error (e.g., logging, rethrowing, etc.)
    console.error("Transaction failed:", error);
    throw error;
  }
};


const getOrders= async (
    params: any,
    options: IPaginationOptions
  ) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationCalculation(options);
    const { searchTerm,  ...filterData } = params;
  const orderSearchingField=['name']
    const andCondition: Prisma.OrderProductWhereInput[] = [];
  
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
  
    const whereCondition: Prisma.OrderProductWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};
  
    const result = await prisma.orderProduct.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
      include:{
        order:true,
        product:true
      }
    });
  
    const total = await prisma.orderProduct.count({
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
  };

const getOrderByProductId = async (id: string) => {
    const result = await prisma.orderProduct.findMany({
        where: {
            productId: id
        },
        include: {
            order: true,
            product: true
        }
    })
    return result;
}
const updateOrder = async (orderId: string,payload:{status:any}) => {
    const result = await prisma.order.update({
        where: {
            id: orderId
        },
        data:{
           status:payload.status
        }
        
    })
    return result;
}
const deleteOrder = async (orderProductId: string) => {
    
    const result = await prisma.orderProduct.delete({
        where: {
            id: orderProductId
        }
        
    })
    return result;
}

export const OrderServices = {
    createOrder,
    getOrders,
    getOrderByProductId,
    updateOrder,
    deleteOrder
}


