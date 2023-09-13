import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/error.js";
import { catchAsyncErrors } from "./tryCatch.js";
import jwt from "jsonwebtoken";


export const isAuthenticatedUser = catchAsyncErrors(
    async (req, res, next) => {
        const { token } = req.cookies
        if (!token) return next(new ErrorHandler("Login first to continue", 401))

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decode.id)

        next()
    }
)


// return func because it is run at routes , not called
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`, 403))
        }

        next()
    }
}