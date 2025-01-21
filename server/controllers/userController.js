const ApiError = require("../utils/ApiError");
const User = require("../models/userModel");
// const sendToken = require("../utils/crJWTTokenAstoreinCokie");
// const sendEmail = require("../utils/sendEmail");

const asyncHandler = require("../utils/asyncHandler");
const { sendToken } = require("../helpers/setJwtToken");
// Register a user
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Please enter all fields");
  }

  const isExisted = await User.findOne({ email: email });
  if (isExisted) {
    throw new ApiError(400, "User already exists with this email.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// Login user
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please enter all fields");
  }
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid Email or Password"); // 401 = unauthorized
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid Email or Password");
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

// // Forgot Password
// //******************************  SEND MAIL ****************** */
// exports.forgetPassword = TryCatch(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new ErrorHandler("User not Found", 404));
//   }

//   //Get ResetPassword Token
//   const resetToken = await user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   // const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`  // wich pass through mail
//   const resetPasswordUrl = `${req.protocol}:://${req.get(
//     "host"
//   )}/password/reset/${resetToken}`; // wich pass through mail

//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n If you have not requested then, ignore it`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "CellCave Password Recovery",
//       message: message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} . `,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorHandler(error.message, 500));
//   }
// });

// // Reset Password
// exports.resetPassword = TryCatch(async (req, res, next) => {
//   //Creating token hash
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(
//       new ErrorHandler(
//         "Reset Password Token is invalid or has been expired",
//         400
//       )
//     );
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return next(
//       new ErrorHandler("Password does not match with confirm password")
//     );
//   }

//   user.password = req.body.password;
//   user.resetPasswordExpire = undefined;
//   user.resetPasswordToken = undefined;

//   await user.save();

//   sendToken(user, 200, res);
// });

// // Get user details
// exports.getUserDetails = TryCatch(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // Update User Password
// exports.updatePassword = TryCatch(async (req, res, next) => {
//   if (
//     !(req.body.oldPassword && req.body.newPassword && req.body.confirmPassword)
//   ) {
//     return next(new ErrorHandler("Please fill all requirements", 401));
//   }

//   const user = await User.findById(req.user.id).select("+password");

//   const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("You entered wrong old password"), 400); // 401 = unauthorized
//   }

//   if (req.body.newPassword !== req.body.confirmPassword) {
//     return next(new ErrorHandler("New passwors doesn't match"));
//   }

//   if (req.body.oldPassword === req.body.newPassword) {
//     return next(new ErrorHandler("Old and new Password can't be same"));
//   }
//   (user.password = req.body.newPassword), await user.save(); // automaticallly run pre method in schema because password modified , and it will convert password to the bcrypt.hash()

//   sendToken(user, 200, res);

//   // res.status(200).json({
//   //     success: true,
//   //     user
//   // })
// });

// // Update User Profile
// exports.updateProfile = TryCatch(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//   };

//   if (req.body.avatar !== "") {
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//       folder: "avatars",
//       width: 150,
//       crop: "scale",
//     });

//     newUserData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//   });
// });

// // get all users  for (admin)
// exports.getAllUsers = TryCatch(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     success: true,
//     users,
//   });
// });

// // get single users  for (admin)
// exports.getSingleUser = TryCatch(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(
//       new ErrorHandler(`User not exists with id ${req.params.id}`, 400)
//     );
//   }

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // Update User Role (admin)
// exports.updateUserRole = TryCatch(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     role: req.body.role,
//   };

//   const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//     new: true,
//     runValidators: true,
//     userFindAndModify: false,
//   });

//   if (!user) {
//     return next(new ErrorHandler("User id not exist", 400));
//   }

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// // delete User (admin)
// exports.deleteUser = TryCatch(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (user.id === req.user._id.toString()) {
//     return next(new ErrorHandler("You cannot delete Yourself", 400));
//   }
//   if (!user) {
//     return next(
//       new ErrorHandler(`User Not exist with id : ${req.params.id}`, 400)
//     );
//   }

//   if (user.avatar.public_id != "avatars/oi02sis7gqvbbvjoebx7") {
//     const imageId = user.avatar.public_id;
//     await cloudinary.v2.uploader.destroy(imageId);
//   }

//   await User.deleteOne({ _id: req.params.id });
//   res.status(200).json({
//     success: true,
//     message: "User deleted successfully",
//   });
// });

// // Admin Routes
// // get all users  for (admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    success: true,
    users,
  });
});

//  Update User to admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { role, userId } = req.body;
  const user = await User.findById(userId);
  user.role = role;
  await user.save();
  return res.status(200).json({
    success: true,
  });
});

//  Delete User
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json({
    success: true,
  });
});

//  Fetch logined user
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    user,
  });
});
