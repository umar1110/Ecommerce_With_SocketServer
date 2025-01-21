const express = require("express");
const {
  addReview,
  updateReview,
  getAllReviews,
  getReviewDetails,
  deleteReview,
} = require("../controllers/reviewController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { uploadProductMedia } = require("../middlewares/multermiddleware");
const router = express.Router();

router
  .route("/:id?")
  .post(isAuthenticatedUser, uploadProductMedia, addReview)
  .put(isAuthenticatedUser, uploadProductMedia, updateReview)
  .delete(isAuthenticatedUser, deleteReview)
  .get(getAllReviews);
router.route("/reviews/details").get(getReviewDetails);
module.exports = router;
