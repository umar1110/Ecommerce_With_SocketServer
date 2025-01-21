const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/reviewModel");
const { unlinkReviewImage } = require("../utils/unlinkFile");
const ApiError = require("../utils/ApiError");
const Product = require("../models/productModel");
const { ApiResponse } = require("../utils/ApiResponse");
const { default: mongoose } = require("mongoose");
const { userRoles } = require("../constants/userConstants");
exports.addReview = asyncHandler(async (req, res) => {
  // If user already reviewed the product than throw an error
  const alreadyReviewed = await Review.findOne({
    product: req.body.productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const reviewImages = req.files?.reviewImages ? req.files.reviewImages : [];
  const images = reviewImages.map((image) => {
    return {
      public_id: image.filename,
      url: `${req.protocol}://${req.get("host")}/uploads\\images\\reviews\\${
        image.filename
      }`,
    };
  });
  const { rating, comment, productId, productName } = req.body;

  //   throw new Error("Test");
  let review;
  try {
    review = await Review.create({
      product: productId,
      user: req.user?._id,
      name: req.user?.name,
      rating,
      comment,
      images,
      productName,
    });

    // Updating product ratings and review count
    const product = await Product.findById(productId);
    const productReviewsSum = await Review.aggregate([
      {
        $match: { product: product._id },
      },
      {
        $group: {
          _id: "$product",
          reviewsSum: { $sum: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);
    const productReviews = productReviewsSum[0];
    product.ratings = productReviews.reviewsSum / productReviews.reviewsCount;
    product.numOfReviews = productReviews.reviewsCount;
    await product.save();
  } catch (error) {
    images.forEach(async (image) => {
      await unlinkReviewImage(image.public_id);
    });
    throw error;
  }

  res.status(201).json({
    success: true,
    review,
  });
});

// Update a review   *** Extra
exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const reviewImages = req.files?.reviewImages ? req.files.reviewImages : [];

  const images = reviewImages.map((image) => {
    return {
      public_id: image.filename,
      url: `${req.protocol}://${req.get("host")}/uploads\\images\\reviews\\${
        image.filename
      }`,
    };
  });

  const { rating, comment, productId } = req.body;

  review.rating = rating;
  review.comment = comment;
  review.images = images;
  await review.save();

  // Updating product ratings and review count
  const product = await Product.findById(productId);
  const productReviewsSum = await Review.aggregate([
    {
      $match: { product: product._id },
    },
    {
      $group: {
        _id: "$product",
        reviewsSum: { $sum: "$rating" },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);
  const productReviews = productReviewsSum[0];
  product.ratings = productReviews.reviewsSum / productReviews.reviewsCount;
  product.numOfReviews = productReviews.reviewsCount;
  await product.save();

  res.status(200).json({
    success: true,
    review,
  });
});

// Get all reviews with pagination , if product id is provided then get reviews of that product
exports.getAllReviews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  let filter = {};
  if (req.query.productId) {
    filter.product = req.query.productId;
  }

  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalReviews = await Review.countDocuments(filter);

  return ApiResponse.success(res, {
    data: {
      reviews,
      pagination: {
        total: totalReviews,
        page,
        pages: Math.ceil(totalReviews / limit),
        limit,
      },
    },
  });
});

// Get review details, number of reviews, 5 star reviews, 4 star reviews, 3 star reviews, 2 star reviews, 1 star reviews
exports.getReviewDetails = asyncHandler(async (req, res) => {
  let match = {};

  if (req.query.productId) {
    // Convert productId to ObjectId
    try {
      match.product = new mongoose.Types.ObjectId(req.query.productId);
    } catch (error) {
      throw new ApiError(400, "Invalid product id");
    }
  }

  const reviewDetails = await Review.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        fiveStarReviews: {
          $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
        },
        fourStarReviews: {
          $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] },
        },
        threeStarReviews: {
          $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] },
        },
        twoStarReviews: {
          $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] },
        },
        oneStarReviews: {
          $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] },
        },
      },
    },
  ]); // returns an array

  const reviewDetail = reviewDetails[0] || {
    totalReviews: 0,
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 0,
    twoStarReviews: 0,
    oneStarReviews: 0,
  };
  return ApiResponse.success(res, {
    data: reviewDetail,
  });
});

// DElete a review
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }
  if (
    req.user.role !== userRoles.ADMIN &&
    review.user.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to delete this review");
  }

  review.images.forEach(async (image) => {
    try {
      await unlinkReviewImage(image.public_id);
    } catch (error) {
      console.error("Failed to delete image:", error.message);
    }
  });

  return ApiResponse.success(res, {
    data: true,
    message: "Review deleted successfully",
  });
});
