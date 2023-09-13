import { catchAsyncErrors } from "../middlewares/tryCatch.js"
import { User } from "../models/userModel.js"
import { ErrorHandler } from "../utils/error.js"
import { createCookie } from "../utils/jwtToken.js"
import { sendEmail } from "../utils/sendMails.js"
import crypto from "crypto"


export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "kuchbhi",
            url: "kuchbhi222"
        }
    })

    createCookie(user, res, 200)
})


export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    let isCorrectPassword = await user.comparePassword(password)
    if (!isCorrectPassword) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    createCookie(user, res, 200)
})



export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(
            Date.now()
        )
    })
        .status(200)
        .json({
            success: true,
            message: "Logged out"
        })
})


export const forgotPassword = catchAsyncErrors(
    async (req, res, next) => {

        const user = await User.findOne({ email: req.body.email })
        if (!user) { return next(new ErrorHandler("Email not found", 404)) }

        const resetToken = user.getResetPasswordToken()
        await user.save({ validateBeforeSave: false })

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;


        console.log(resetToken)
        try {
            await sendEmail({
                email: user.email,
                subject: "Ecommerce Password Recovery",
                message: message
            })

            res
                .status(200)
                .json({
                    success: true,
                    message: `Message successfully sent to ${user.email}`
                })

        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({ validateBeforeSave: false })
            return next(new ErrorHandler(error.message, 500))
        }
    }
)


export const resetPassword = catchAsyncErrors(
    async (req, res, next) => {

        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
        if (!user) { return next(new ErrorHandler("Invalid token or has already expired", 400)) }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("confirmed password is not matched with new password", 400))
        }

        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        createCookie(user, res, 200)
    }
)
export const getUserDetails = catchAsyncErrors(
    async (req, res, next) => {
        res.status(200)
            .json({
                success: true,
                user: req.user
            })

    }
)

export const updatePassword = catchAsyncErrors(
    async (req, res, next) => {
        let user = await User.findById(req.user._id).select("+password")

        const isMatched = await user.comparePassword(req.body.oldPassword)
        if (!isMatched) {
            return next(new ErrorHandler("password incorrect", 400))
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler("password does not match", 400))
        }

    }
)

export const updateProfile = catchAsyncErrors(
    async (req, res, next) => {

        // both must be given in frontend, same old if not changed
        const updates = {
            name: req.body.name,
            email: req.body.email,
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        // no need of save in this method

        res.status(200).json({
            success: true,
            user
        })

    }
)

// for admin -update role of user
export const updateRole = catchAsyncErrors(
    async (req, res, next) => {

        const updates = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        // no need of save in this method

        res.status(200).json({
            success: true,
            message: `Role of user ${user.name} is updated successfully`

        })

    }
)

// for admin -delete user th. id 
export const deleteUser = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.params.id)

        if (!user) {
            return next(new ErrorHandler("User not found ,invalid id ", 404))
        }

        await User.deleteOne({ "_id" : req.params.id })
        res.status(200).json({
            success: true,
            message:"user deleted successfully"
        })
    }
)

// for admin = all users
export const getAllUsers = catchAsyncErrors(
    async (req, res, next) => {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users
        })

    }
)
// for admin = single user
export const getSingleUser = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler("User not found, invalid id ", 404))
        }

        res.status(200).json({
            success: true,
            user
        })

    }
)
