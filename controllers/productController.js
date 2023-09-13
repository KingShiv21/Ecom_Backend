import { catchAsyncErrors } from "../middlewares/tryCatch.js"
import { Product } from "../models/productModel.js"
import { ApiFeatures } from "../utils/apiFeatures.js"
import { ErrorHandler } from "../utils/error.js"

// all are for admin

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 5
    const productCount = await Product.countDocuments()

    const objAddress = new ApiFeatures(Product.find() , req.query).search().filter().pagination(resultPerPage)
    const products = await objAddress.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    })
})

export const createProduct = catchAsyncErrors( async (req, res, next) => {
    req.body.user = req.user._id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})


// req.params = obj
// best way to update directly th forms format
export const updateProduct = catchAsyncErrors( async (req, res, next) => {

        let product = await Product.findById(req.params.id)
        if (!product) {
            return next(new ErrorHandler("product not found", 404))
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: true
        })
        res.status(200).json({
            success: true,
            product
        })

})


export const deleleProduct = catchAsyncErrors( async (req, res, next) => {

        let product = await Product.findById(req.params.id)
        if (!product) {
            return next(new ErrorHandler("product not found", 404))
        }
        await product.deleteOne()
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

})



export const singleProduct = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})


// create or update review
export const createProductReview = catchAsyncErrors( async (req, res, next) => {
    const {rating,comment,productID} = req.body
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating : Number(rating),
        comment
    }

    const product = await Product.findById(productID)
    const isReviewed = product.reviews.find(
        (rev) => {
            rev.user.toString() === req.user._id.toString()
        } 
    )

    if (isReviewed) {
        product.reviews.forEach(
            (rev) => {
               if ( rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                rev.comment = comment
               } 

            } 
        )
        
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    // overall product rating

    let avg = 0 
    product.reviews.forEach(
        (rev) => {
            avg+=rev.rating
        } 
    )

    product.ratings = avg / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
})




// get all reviews of product
export const getAllReviews = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.query.id)
    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }

    res.status(200).json({
      success: true,
      reviews : product.reviews
    });
})

// delete a review
export const deleteReview = catchAsyncErrors(
    async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }

    const reviews = product.reviews.filter(
        (rev)=>{
            rev._id.toString() !== req.query.id.toString()
        }
    )

    let avg = 0
    reviews.forEach(
        (rev)=>{
            avg+=rev.rating
        }
    )

    let ratings = 0
    if (reviews.length === 0) {
    ratings = 0
    } else {
    ratings = avg / reviews.length
    }

    let numOfReviews =  reviews.length

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
          reviews,
          ratings,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
    )

    res.json({
        success:true
    })

    }
)