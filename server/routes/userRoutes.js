const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getMe,
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  checkAllowedRoles,
} = require("../middlewares/auth");
const { userRoles } = require("../constants/userConstants");
const router = express.Router();

// Admin routes
router
  .route("/")
  .get(isAuthenticatedUser, checkAllowedRoles([userRoles.ADMIN]), getAllUsers);
router
  .route("/updaterole")
  .post(
    isAuthenticatedUser,
    checkAllowedRoles([userRoles.ADMIN]),
    updateUserRole
  );

router
  .route("/deleteuser/:id")
  .delete(
    isAuthenticatedUser,
    checkAllowedRoles([userRoles.ADMIN]),
    deleteUser
  );
//   public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getMe);
module.exports = router;
