import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { userServices } from "./userServices";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";


const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdminIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin Create Successfully",
    data: result,
  });
});



// const myProfile = catchAsync(
//   async (req: Request & { user?: any }, res: Response) => {
//     const user = req.user;
//     const result = await userServices.myProfileFromDB(user);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Profile Get Successfully",
//       data: result,
//     });
//   }
// );

export const userController = {
  createAdmin
};
