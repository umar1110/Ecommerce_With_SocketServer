const mongoose = require("mongoose");

const ApiError = require("../utils/ApiError.js");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // if not
    // create a new ApiError instance to keep the consistency
    // assign an appropriate status code
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    let message;
    // Add product without data
    if (err.name === "ValidationError") {
      console.error("Validation Error:", err);
      message = "Validation Error , Enter valid and complete data";
    } else if (err.code === 11000) {
      message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    } else if (err.name === "JsonWebTokenError") {
      message = "Json web token is invalid , Try again";
    } else if (err.name === "TokenExpiredError") {
      message = "Json web token is Expired , Try again";
    } else if (err.name === "CastError") {
      message = `Resource not found. Invalid: ${err.path}`;
    } else if (err.name === "MulterError") {
      message = "Image Upload Error";
    } else {
      // set a message from native Error instance or a custom one
      message = error.message || "Something went wrong";
    }
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    sucess: false,
    ...(process.env.NODE_ENV === "DEVELOPMENT" ? error : []),
    message: error.message,
    ...(process.env.NODE_ENV === "DEVELOPMENT" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  // removeUnusedMulterImageFilesOnError(req);
  // Send error response
  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
