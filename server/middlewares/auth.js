const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new ApiError(401, "Login To access the route.");
  }

  const decodedDataID = jwt.verify(token, process.env.JWT_SECRET);
  try {
    req.user = await User.findById(decodedDataID.id);
  } catch (err) {
    return next(new Error("User Not Exists , As per in ccokies chnaged"));
    // ***************** remove the cookie info from message *************
  }

  next();
});

const checkAllowedRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role | "";
    const hasRole = allowedRoles.includes(userRole);
    if (!hasRole) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }

    next();
  };
};

module.exports = {
  isAuthenticatedUser,
  checkAllowedRoles,
};
