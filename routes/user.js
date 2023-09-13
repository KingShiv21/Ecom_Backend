import express from "express"
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js"; 
import { loginUser, logoutUser, registerUser, forgotPassword, resetPassword,getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, deleteUser, updateRole } from "../controllers/userController.js";

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser , getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)

// admin routes
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateRole)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

export default router;