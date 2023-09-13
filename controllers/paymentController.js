import { catchAsyncErrors } from "../middlewares/tryCatch.js"
import { ErrorHandler } from "../utils/error.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const processPayment = catchAsyncErrors(
    async (req,res,next) =>{
        const myPayment = await stripe.paymentIntents.create({
            amount : req.body.amount,
            currency: "inr",
            metadata:{
                company: "Ecommerce"
            }
        })

        res.status(200).json({
            success:true,
            client_secret: myPayment.client_secret
        })
    }
)


export const getStripeApiKey = catchAsyncErrors(
    async (req,res,next) =>{

        res.status(200).json({
            success:true,
            stripeApiKey : process.env.STRIPE_API_KEY
        })
    }
)