import express from "express"
import { newOrder, getAllOrders , getSingleOrder, getAllUserOrders , updateOrder ,deleteOrder} from "../controllers/orderController.js"
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js"


const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, getAllUserOrders);


// admin routes
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);


export default router