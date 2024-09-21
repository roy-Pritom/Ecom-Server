"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Prisma_1 = __importDefault(require("../../App/Common/Prisma"));
const ApiError_1 = __importDefault(require("../../App/Error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createToken_1 = require("../../App/Common/createToken");
const config_1 = __importDefault(require("../../App/config"));
const userLoginFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found !");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new Error("Incorrect password");
    }
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.accessToken, config_1.default.accessTokenExpireDate);
    const refreshToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.refreshToken, config_1.default.refreshTokenExpireDate);
    return {
        accessToken,
        refreshToken,
    };
});
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
exports.authService = {
    userLoginFromDB,
};
