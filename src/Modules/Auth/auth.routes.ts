import express from "express";
import validationRequest from "../../Middleware/validationRequest";
import { userLoginSchema } from "./authValidation";
import { authController } from "./authController";

const router = express.Router();
router.post(
  "/login",
  validationRequest(userLoginSchema),
  authController.userLogin
);


export const authRoutes = router;
