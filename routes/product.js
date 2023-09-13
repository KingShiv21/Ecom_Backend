import express from "express"
import { getAllProducts , createProduct, updateProduct, deleleProduct, singleProduct, createProductReview, deleteReview, getAllReviews } from "../controllers/productController.js"
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js"

 const router = express.Router()

router.route("/products").get( getAllProducts)

router.route("/admin/product/new").post( isAuthenticatedUser , authorizeRoles("admin")  ,createProduct)

router.route("/admin/product/:id")
.put( isAuthenticatedUser , authorizeRoles("admin") ,updateProduct)
.delete( isAuthenticatedUser , authorizeRoles("admin") ,deleleProduct)

router.route("/product/:id").get(singleProduct)

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getAllReviews)
  .delete(isAuthenticatedUser, deleteReview);

export default router;