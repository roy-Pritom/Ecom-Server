import express from "express";
import { ProductControllers } from "./product.controller";
import { fileUploader } from "../../Utilities/fileUploader";
const router = express.Router();

router.post("/create",fileUploader.upload.array("file"),ProductControllers.createdProduct);
router.get("/",ProductControllers.getAllProduct);
router.get("/:id",ProductControllers.getSingleProduct);
router.get("/category/:categoryId",ProductControllers.getProductsByCategory);
router.delete("/:id",ProductControllers.deleteProduct);
router.patch("/:id",ProductControllers.updateProduct);

export const ProductRoutes = router;
