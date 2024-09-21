import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import pick from "../../App/Common/Pick";
import { optionsPaginationFields, userFilterableFields } from "../User/userConstant";
import { ProductServices } from "./product.service";
import { productFilterableFields } from "./product.constant";

const createdProduct = catchAsync(async (req: Request, res: Response) => {
  
  // Assuming req.body.data contains product details
  const result = await ProductServices.createdProduct(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});


const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.params;
  const result = await ProductServices.getSingleProductFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetch Successfully",
    data: result,
  });
});
const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, productFilterableFields);
  const optionsData = pick(req.query, optionsPaginationFields);
  const result = await ProductServices.getAllProductFormDB(
    filterData,
    optionsData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Fetch Successfully",
    data: result,
  });
});
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Delete Successfully",
    data: result,
  });
});
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.updateProduct(req,id,req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated Successfully",
    data: result,
  });
});

// get deleted products
const getDeletedProducts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.getDeletedProducts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieve Successfully",
    data: result,
  });
});
const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const result = await ProductServices.getProductsByCategory(categoryId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieve Successfully",
    data: result,
  });
});

export const ProductControllers = {
  createdProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
  getSingleProduct,
  getProductsByCategory

};
