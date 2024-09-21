import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { authService } from "./authService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";


const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.userLoginFromDB(req.body);
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Login Successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
});


export const authController = {
  userLogin,
};
