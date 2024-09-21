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
exports.ProductServices = void 0;
const Prisma_1 = __importDefault(require("../../App/Common/Prisma"));
const paginationCalculation_1 = __importDefault(require("../../Utilities/paginationCalculation"));
const product_constant_1 = require("./product.constant");
const fileUploader_1 = require("../../Utilities/fileUploader");
const createdProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files; // Handle multiple files
    let images;
    // Process files if any are uploaded
    if (files && files.length > 0) {
        const cloudinaryImgs = yield Promise.all(files.map((file) => fileUploader_1.fileUploader.uploadToCloudinary(file)));
        images = cloudinaryImgs.map((img) => img.secure_url);
    }
    // console.log(req.body.data);
    const data = JSON.parse(req.body.data);
    // Prepare data for images
    const imagesData = images === null || images === void 0 ? void 0 : images.map((img) => ({
        img,
        isDeleted: false,
    }));
    // Create the product in the database
    const result = yield Prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, data), { images: {
                create: imagesData,
            } }),
    });
    return result;
});
const getSingleProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: true,
            orderItems: true
        }
    });
    if (!result) {
        throw new Error('Product not exist!');
    }
    return result;
});
const getAllProductFormDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationCalculation_1.default)(options);
    const { searchTerm, maxPrice, minPrice } = params, filterData = __rest(params, ["searchTerm", "maxPrice", "minPrice"]);
    const andCondition = [];
    // Search Term Condition
    if (searchTerm) {
        andCondition.push({
            OR: product_constant_1.productSearchingField.map((field) => ({
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
                equals: filterData[key],
            },
        }));
        andCondition.push(...filterConditions);
    }
    // Max Price Condition
    const parsedMaxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined;
    if (!isNaN(parsedMaxPrice)) {
        andCondition.push({
            price: {
                lte: parsedMaxPrice,
            },
        });
    }
    // Min Price Condition
    const parsedMinPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined;
    if (!isNaN(parsedMinPrice)) {
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
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield Prisma_1.default.product.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "asc" },
        include: {
            images: true,
            category: true
        }
    });
    const total = yield Prisma_1.default.product.count({
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
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Prisma_1.default.product.findUniqueOrThrow({
        where: { id },
    });
    const result = yield Prisma_1.default.product.update({
        where: {
            id
        },
        data: { isDeleted: true }
    });
    return result;
});
const updateProduct = (req, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const files = req.files; // Handle multiple files
    let uploadedImages = [];
    // Upload files if any
    if (files && files.length > 0) {
        const cloudinaryImgs = yield Promise.all(files.map((file) => fileUploader_1.fileUploader.uploadToCloudinary(file)) // Upload each file
        );
        uploadedImages = cloudinaryImgs.map((img) => ({
            img: img.secure_url,
            isDeleted: false,
        }));
    }
    // Fetch the current product along with related images, colors, and sizes
    const product = yield Prisma_1.default.product.findUnique({
        where: { id },
        include: {
            images: true,
        },
    });
    if (!product) {
        throw new Error('Product does not exist!');
    }
    // Prepare updates for images
    const imagesUpdates = {
        create: [],
        updateMany: [],
        deleteMany: [],
    };
    // Handle image deletions
    const deleteImages = (_b = (_a = payload.images) === null || _a === void 0 ? void 0 : _a.delete) === null || _b === void 0 ? void 0 : _b.map((img) => img.img);
    if (deleteImages && deleteImages.length > 0) {
        imagesUpdates.deleteMany = {
            img: { in: deleteImages },
        };
    }
    // Handle image additions (either uploaded or from payload)
    const imagesToAdd = [
        ...uploadedImages.filter((img) => !img.isDeleted),
        ...(((_d = (_c = payload.images) === null || _c === void 0 ? void 0 : _c.create) === null || _d === void 0 ? void 0 : _d.filter((img) => !img.isDeleted)) || []), // Only add payload images that are not marked as deleted
    ];
    if (imagesToAdd.length > 0) {
        imagesUpdates.create = imagesToAdd.map((img) => ({
            img: img.img,
            isDeleted: false,
        }));
    }
    // Update the product with the payload and nested updates
    const updatedProduct = yield Prisma_1.default.product.update({
        where: { id },
        data: Object.assign(Object.assign({}, payload), { images: imagesUpdates }),
    });
    return updatedProduct;
});
const getDeletedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            isDeleted: true
        }
    });
});
const getProductsByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.default.product.findMany({
        where: {
            categoryId
        },
        include: {
            category: true,
            images: true
        }
    });
    return result;
});
exports.ProductServices = {
    createdProduct,
    getAllProductFormDB,
    deleteProductFromDB,
    getSingleProductFromDb,
    updateProduct,
    getDeletedProducts,
    getProductsByCategory
};
