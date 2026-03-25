import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";

const UserRegister = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        console.log(payload,'payloddata')

        console.log(payload);

        const result = await AuthService.UserRegister(payload);

         const { accessToken, refreshToken, token, ...rest } = result
        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: result,
        })
    }
)

export const AuthController = {
    UserRegister
    
};