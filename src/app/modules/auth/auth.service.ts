import AppError from "../../errorHelper/AppError";
import { auth } from "../../lib/auth";
import { tokenUtils } from "../../utils/token";
import { ICreateUser } from "./auth.interface";
import status from "http-status";
const UserRegister = async (payload:ICreateUser) => {
    const { name, email, password,role,status } = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role,
           status

        }
    })
    if (!data.user) {
        throw new AppError(400, "User register failed");
    }

    const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            token:data.token,
            accessToken,
            refreshToken,
        }
}

export const AuthService = {
    UserRegister,
};