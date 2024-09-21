"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("./categoryController");
const router = express_1.default.Router();
router.post("/create", categoryController_1.categoryController.createdCategory);
router.get("", categoryController_1.categoryController.allCategory);
router.patch("/:id", categoryController_1.categoryController.deletedCategory);
router.delete("/:id", categoryController_1.categoryController.deleteCategory);
exports.categoryRoutes = router;
