"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const fileUploader_1 = require("../../Utilities/fileUploader");
const router = express_1.default.Router();
router.post("/create", fileUploader_1.fileUploader.upload.array("file"), product_controller_1.ProductControllers.createdProduct);
router.get("/", product_controller_1.ProductControllers.getAllProduct);
router.get("/:id", product_controller_1.ProductControllers.getSingleProduct);
router.get("/category/:categoryId", product_controller_1.ProductControllers.getProductsByCategory);
router.delete("/:id", product_controller_1.ProductControllers.deleteProduct);
router.patch("/:id", product_controller_1.ProductControllers.updateProduct);
exports.ProductRoutes = router;
