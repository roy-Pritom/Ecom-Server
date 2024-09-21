import { Prisma } from "@prisma/client";
import prisma from "../../App/Common/Prisma";
import paginationCalculation from "../../Utilities/paginationCalculation";
import { IPaginationOptions } from "../User/userInterface";
import { productSearchingField } from "./product.constant";
import { fileUploader } from "../../Utilities/fileUploader";
import { ICloudinaryResponse, IFile } from "../../Helpers/file";
import { Request } from "express";




const createdProduct = async (req:Request) => {
  const files = req.files as Express.Multer.File[]; // Handle multiple files
  let images;
  // Process files if any are uploaded
  if (files && files.length > 0) {
    const cloudinaryImgs = await Promise.all(
      files.map((file: IFile) => fileUploader.uploadToCloudinary(file))
    );
    images= cloudinaryImgs.map(
      (img: any) => img.secure_url
    );
  }
// console.log(req.body.data);
  const data=JSON.parse(req.body.data);

  // Prepare data for images
  const imagesData = images?.map((img) => ({
    img,
    isDeleted: false,
  }));
  
  // Create the product in the database
  const result = await prisma.product.create({
    data: {
      ...data,
      images: {
        create: imagesData,
      }
    },
  });

  return result;
};



const getSingleProductFromDb = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id },
    include:{
      category:true,
      images:true,
      orderItems:true
    }
  }); 
  if (!result) {
    throw new Error('Product not exist!')
  }
  return result;
}

const getAllProductFormDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationCalculation(options);
  const { searchTerm, maxPrice, minPrice, ...filterData } = params;

  const andCondition: Prisma.ProductWhereInput[] = [];

  // Search Term Condition
  if (searchTerm) {
    andCondition.push({
      OR: productSearchingField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter Data Conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andCondition.push(...filterConditions);
  }

 // Max Price Condition
 const parsedMaxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined;
 if (!isNaN(parsedMaxPrice as number)) {
   andCondition.push({
     price: {
       lte: parsedMaxPrice,
     },
   });
 }

 // Min Price Condition
 const parsedMinPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined;
 if (!isNaN(parsedMinPrice as number)) {
   andCondition.push({
     price: {
       gte: parsedMinPrice,
     },
   });
 }

  andCondition.push({
    isDeleted: false,
  });
  // console.log(maxPrice,minPrice);

  const whereCondition: Prisma.ProductWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.product.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
    include:{
      images:true,
      category:true
    }
  });

  const total = await prisma.product.count({
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

const deleteProductFromDB = async (id: string) => {
  await prisma.product.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.product.update({
    where: {
      id
    },
    data: { isDeleted: true }
  });
  return result;
};



type TProduct = {
  id: string;
  name: string;
  images: string[];
  price: number;
  discount: number;
  description: string;
  details: string;
  sizes: string[];
  colors: string[];
};

const updateProduct = async (
  req: Request,
  id: string,
  payload: Partial<Prisma.ProductUpdateInput> & {
    images?: {
      create?: { img: string; isDeleted?: boolean }[];
      delete?: { img: string }[];
    }
  }
) => {
  const files = req.files as Express.Multer.File[]; // Handle multiple files
  let uploadedImages: { img: string; isDeleted?: boolean }[] = [];

  // Upload files if any
  if (files && files.length > 0) {
    const cloudinaryImgs = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file)) // Upload each file
    );
    uploadedImages = cloudinaryImgs.map((img: any) => ({
      img: img.secure_url,
      isDeleted: false,
    }));
  }

  // Fetch the current product along with related images, colors, and sizes
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) {
    throw new Error('Product does not exist!');
  }

  // Prepare updates for images
  const imagesUpdates: Prisma.ImageUpdateManyWithoutProductNestedInput = {
    create: [],
    updateMany: [],
    deleteMany: [],
  };

  // Handle image deletions
  const deleteImages = payload.images?.delete?.map((img) => img.img);
  if (deleteImages && deleteImages.length > 0) {
    imagesUpdates.deleteMany = {
      img: { in: deleteImages },
    };
  }

  // Handle image additions (either uploaded or from payload)
  const imagesToAdd = [
    ...uploadedImages.filter((img) => !img.isDeleted), // Only add uploaded images that are not marked as deleted
    ...(payload.images?.create?.filter((img) => !img.isDeleted) || []), // Only add payload images that are not marked as deleted
  ];

  if (imagesToAdd.length > 0) {
    imagesUpdates.create = imagesToAdd.map((img) => ({
      img: img.img,
      isDeleted: false,
    }));
  }

  
  // Update the product with the payload and nested updates
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...payload,
      images: imagesUpdates,
    },
  });

  return updatedProduct;
};


const getDeletedProducts=async()=>{
  const result=await prisma.product.findMany({
    where:{
      isDeleted:true
    }
  })
}

const getProductsByCategory=async(categoryId:string)=>{
const result=await prisma.product.findMany({
  where:{
    categoryId
  },
  include:{
    category:true,
    images:true
  }
})
return result;
}

export const ProductServices = {
  createdProduct,
  getAllProductFormDB,
  deleteProductFromDB,
  getSingleProductFromDb,
  updateProduct,
  getDeletedProducts,
  getProductsByCategory
  
};
