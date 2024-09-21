import express from "express";
import validationRequest from "../../Middleware/validationRequest";
import { adminValidationSchema } from "./userValidation";
import { userController } from "./userController";

const router = express.Router();

router.post(
  "/register",
  validationRequest(adminValidationSchema.createAdminSchema),
  userController.createAdmin
);

export const userRoutes = router;
