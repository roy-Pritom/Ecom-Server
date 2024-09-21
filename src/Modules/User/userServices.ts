import prisma from "../../App/Common/Prisma";
import bcrypt from "bcrypt";
import { IUser } from "./userInterface";
import { UserRole } from "@prisma/client";

const createAdminIntoDB = async (payload: IUser) => {
  const hashPassword: string = await bcrypt.hash(payload.password, 12);
  const adminData = {
    name: payload.name,
    email: payload.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const result=await prisma.user.create({
    data:adminData
  })
  return result;
};



// const myProfileFromDB = async (user: ITokenUser) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: user.email,
//       status: UserStatus.ACTIVE,
//     },
//   });

//   const profileData = await prisma.profile.findUniqueOrThrow({
//     where: {
//       email: userData.email,
//     },
//   });

//   return profileData;
// };


export const userServices = {
  createAdminIntoDB,
};
