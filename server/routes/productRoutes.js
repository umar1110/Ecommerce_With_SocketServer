const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getHomeProducts,
  getFeaturedProducts,
  changeFeaturedStatus,
} = require("../controllers/productController");
const { uploadProductMedia } = require("../middlewares/multermiddleware");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");

router
  .route("/")
  .get(getAllProducts)
  .post(isAuthenticatedUser, uploadProductMedia, createProduct);
router
  .route("/:id")
  .put(isAuthenticatedUser, uploadProductMedia, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct);

router.route("/details/:id?").get(getProductDetails).post(getProductDetails);

router.route("/products/home").get(getHomeProducts);
router.route("/products/featured").get(getFeaturedProducts);
router
  .route("/changefeaturestatus")
  .post(isAuthenticatedUser, changeFeaturedStatus);
module.exports = router;
