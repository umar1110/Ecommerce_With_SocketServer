const express = require("express");
const {
  createOrder,
  getSingleOrder,
  getAllOrders,
  getMyOrders,
  deleteOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  checkAllowedRoles,
} = require("../middlewares/auth");
const { userRoles } = require("../constants/userConstants");
const router = express.Router();

router
  .route("/")
  .get(isAuthenticatedUser, checkAllowedRoles([userRoles.ADMIN]), getAllOrders)
  .post(isAuthenticatedUser, createOrder);
router
  .route("/:id")
  .get(isAuthenticatedUser, getSingleOrder)
  .delete(
    isAuthenticatedUser,
    checkAllowedRoles([userRoles.ADMIN]),
    deleteOrder
  );
router.route("/orders/myorders").get(isAuthenticatedUser, getMyOrders);
router.route("/:id/status").put(isAuthenticatedUser, updateOrderStatus);

module.exports = router;
