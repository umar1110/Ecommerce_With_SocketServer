const express = require("express");
const {
  createMainCategory,
  getAllMainAndSubCategories,
  createCategory,
  getCategories,
  createSubCategory,
  getSubCategories,
  getAllMainCategories,
  getAllCategories,
  getAllSubCategories,
  updateMainCategoryFeatureOrOffer,
  deleteMainCategory,
  deleteCategory,
  deleteSubCategory,
} = require("../controllers/categoryController");
const {
  isAuthenticatedUser,
  checkAllowedRoles,
} = require("../middlewares/auth");
const { userRoles } = require("../constants/userConstants");
const router = express.Router();

router.route("/").get(getAllMainAndSubCategories);
router
  .route("/maincategory")
  .post(
    isAuthenticatedUser,
    checkAllowedRoles([userRoles.ADMIN]),
    createMainCategory
  )
  .get(getAllMainCategories);

router
  .route("/category")
  .post(
    isAuthenticatedUser,
    checkAllowedRoles([userRoles.ADMIN]),
    createCategory
  )
  .put(getCategories);

router
  .route("/subcategory")
  .post(
    isAuthenticatedUser,
    checkAllowedRoles([userRoles.ADMIN]),
    createSubCategory
  )
  .put(getSubCategories);

router.route("/allcategories").get(getAllCategories);
router.route("/allsubcategories").get(getAllSubCategories);
router
  .route("/update/maincategory/featured/offer")
  .put(updateMainCategoryFeatureOrOffer);

// For delete category and subcategory and main category
router.route("/delete/maincategory/:id").delete(deleteMainCategory);
router.route("/delete/category/:id").delete(deleteCategory);
router.route("/delete/subcategory/:id").delete(deleteSubCategory);

module.exports = router;
