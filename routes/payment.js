import express from "express"
import { isAuthenticatedUser } from "../middlewares/auth";
import { getStripeApiKey, processPayment } from "../controllers/paymentController";

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment)
router.route("/stripeapikey").get(isAuthenticatedUser, getStripeApiKey)

export default router

