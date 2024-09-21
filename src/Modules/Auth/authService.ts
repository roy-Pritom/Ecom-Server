import bcrypt from "bcrypt";
import prisma from "../../App/Common/Prisma";
import {  ILogin } from "./authInterface";
import ApiError from "../../App/Error/ApiError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { createToken } from "../../App/Common/createToken";
import config from "../../App/config";
import { verifyToken } from "../../Utilities/veriflyToken";


const userLoginFromDB = async (payload: ILogin) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found !");
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isCorrectPassword) {
    throw new Error("Incorrect password");
  }

  const jwtPayload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.accessToken as string,
    config.accessTokenExpireDate as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.refreshToken as string,
    config.refreshTokenExpireDate as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

// const refreshToken = async (token: string) => {
//   let decodedData;
//   try {
//     decodedData = verifyToken(token, config.refreshToken as string);
//   } catch (err) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Your are not authorized !");
//   }
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: decodedData.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   if (!userData) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User Data Not Found !");
//   }

//   const jwtPayload: JwtPayload = {
//     id: userData.id,
//     email: userData.email,
//     role: userData.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.accessToken as string,
//     config.accessTokenExpireDate as string
//   );

//   return {
//     accessToken,
//   };
// };


export const authService = {
  userLoginFromDB,
  
};
