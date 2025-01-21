const MainCategory = require("../models/mainCategoryModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
// Create a new main category
exports.createMainCategory = asyncHandler(async (req, res) => {
  const { name, description, isFeatured, isOffer } = req.body;

  const categoryExists = await MainCategory.findOne({ name });
  if (categoryExists) {
    throw new ApiError(400, "Main category already exists");
  }

  const mainCategory = await MainCategory.create({
    name,
    description,
    isFeatured,
    isOffer,
  });

  return ApiResponse.success(res, {
    data: mainCategory,
    message: "Main category created successfully",
  });
});

// Get all main categories
exports.getAllMainAndSubCategories = asyncHandler(async (req, res) => {
  const allCategories = [];

  const mainCategories = await MainCategory.find();
  for (const mainCategory of mainCategories) {
    const categories = await Category.find({ mainCategory: mainCategory._id });
    const categoryList = [];
    for (const category of categories) {
      const subCategories = await SubCategory.find({ category: category._id });
      const subCategoryList = [];
      for (const subCategory of subCategories) {
        subCategoryList.push({
          name: subCategory.name,
          id: subCategory._id,
        });
      }
      categoryList.push({
        name: category.name,
        id: category._id,
        subCategories: subCategoryList,
      });
    }
    allCategories.push({
      mainCategory: {
        name: mainCategory.name,
        id: mainCategory._id,
        isOffer: mainCategory.isOffer,
        categories: categoryList,
      },
    });
  }

  return ApiResponse.success(res, {
    data: allCategories,
  });
});

//  Create Category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, mainCategory } = req.body;

  const MainCategoryExists = await MainCategory.findById(mainCategory);
  if (!MainCategoryExists) {
    throw new ApiError(400, "Main category does not exist");
  }

  const category = await Category.create({
    name,
    description,
    mainCategory,
  });

  return ApiResponse.success(res, {
    data: category,
    message: "Category created successfully",
  });
});

// Get all categories of Main Category
exports.getCategories = asyncHandler(async (req, res) => {
  const { mainCategoryId } = req.body;

  const categories = await Category.find({ mainCategory: mainCategoryId });

  return ApiResponse.success(res, {
    data: categories,
  });
});

// Create subCategory
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  const CategoryExists = await Category.findById(category);
  if (!CategoryExists) {
    throw new ApiError(400, "Category does not exist");
  }

  const subCategory = await SubCategory.create({
    name,
    description,
    category,
  });

  return ApiResponse.success(res, {
    data: subCategory,
    message: "Sub category created successfully",
  });
});

// Get all sub categories of Category
exports.getSubCategories = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;

  const subCategories = await SubCategory.find({ category: categoryId });

  return ApiResponse.success(res, {
    data: subCategories,
  });
});

//  get all main categories
exports.getAllMainCategories = asyncHandler(async (req, res) => {
  const mainCategories = await MainCategory.find();

  return ApiResponse.success(res, {
    data: mainCategories,
  });
});

//  Get All categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return ApiResponse.success(res, {
    data: categories,
  });
});

// get all sub categories
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find();

  return ApiResponse.success(res, {
    data: subCategories,
  });
});

exports.updateMainCategoryFeatureOrOffer = asyncHandler(async (req, res) => {
  const { mainCategoryId, isFeatured, isOffer } = req.body;

  const mainCategory = await MainCategory.findById(mainCategoryId);
  if (!mainCategory) {
    throw new ApiError(404, "Main category not found");
  }
  if (isFeatured != undefined && isFeatured != mainCategory.isFeatured) {
    mainCategory.isFeatured = isFeatured;
  }
  if (isOffer != undefined && isOffer != mainCategory.isOffer) {
    mainCategory.isOffer = isOffer;
  }

  await mainCategory.save();

  return ApiResponse.success(res, {
    data: mainCategory,
    message: "Main category updated successfully",
  });
});

// Delete main category and its all products
exports.deleteMainCategory = asyncHandler(async (req, res) => {
  const mainCategory = await MainCategory.findByIdAndDelete(req.params.id);

  if (!mainCategory) {
    throw new ApiError(
      404,
      `Main category not found with id of ${req.params.id} `
    );
  }
  //  Delete all categories of main category and subcategories of categoreis
  const categories = await Category.find({ mainCategory: req.params.id });
  for (const category of categories) {
    await SubCategory.deleteMany({ category: category._id });
  }
  await Category.deleteMany({ mainCategory: req.params.id });

  return ApiResponse.success(res, {
    message:
      "Main category and related categories and subcategories deleted deleted successfully",
  });
});

// Delete category and its all products
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError(404, `Category not found with id of ${req.params.id} `);
  }

  // Delete all subcategories of category
  await SubCategory.deleteMany({ category: req.params.id });

  return ApiResponse.success(res, {
    message: "Category and related subcategories deleted successfully",
  });
});

// Delete sub category and its all products
exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

  if (!subCategory) {
    throw new ApiError(
      404,
      `Sub category not found with id of ${req.params.id} `
    );
  }

  return ApiResponse.success(res, {
    message: "Sub category deleted successfully",
  });
});
