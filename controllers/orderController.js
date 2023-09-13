import { Order } from "../models/orderModel.js";
import { catchAsyncErrors } from "../middlewares/tryCatch.js"
import { ErrorHandler } from "../utils/error.js"
import { Product } from "../models/productModel.js"

// create order
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});


//   for single order
export const getSingleOrder = catchAsyncErrors(
    async (req, res, next) => {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        )

        if (!order) {
            return next(new ErrorHandler("Order not found, invalid id", 404))
        }

        res.status(200).json({
            success: true,
            order
        })
    })


//   all user orders
export const getAllUserOrders = catchAsyncErrors(
    async (req, res, next) => {
        const orders = await Order.find({ user: req.user._id })


        res.status(200).json({
            success: true,
            orders
        })
    })


//   all orders - Admin
export const getAllOrders = catchAsyncErrors(
    async (req, res, next) => {
        const orders = await Order.find()

        let totalAmount = 0
        orders.forEach(
            (o) => {
                totalAmount += o.totalPrice
            }
        )


        res.status(200).json({
            success: true,
            totalAmount,
            orders
        })
    })

// delete order --admin
export const deleteOrder = catchAsyncErrors(
    async (req, res, next) => {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return next(new ErrorHandler("Order not found, invalid id", 404))
        }

        await Order.deleteOne({
            "_id": req.params.id
        })

        res.status(200).json({
            success: true,
            order
        })
    })


// update order
export const updateOrder = catchAsyncErrors(
    async (req, res, next) => {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return next(new ErrorHandler("Order not found, invalid id", 404))
        }

        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("You have already delivered this order", 400));
          }

        order.orderStatus = req.body.status
        if (req.body.status === "Shipped") {
            order.orderItems.forEach(
                async (o) => { await updateStockFunc(o.product, o.quantity) }
            )
        }

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now()
        }

        await order.save({ validateBeforeSave: false })
        res.status(200).json({
            success: true,
            order
        })
    })

async function updateStockFunc(id, quantity) {
    let product = await Product.findById(id)
    product.Stock -= quantity
    await product.save({
        validateBeforeSave: false,
    })
}