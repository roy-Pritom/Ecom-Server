"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../Middleware/validationRequest"));
const userValidation_1 = require("./userValidation");
const userController_1 = require("./userController");
const router = express_1.default.Router();
router.post("/register", (0, validationRequest_1.default)(userValidation_1.adminValidationSchema.createAdminSchema), userController_1.userController.createAdmin);
exports.userRoutes = router;
