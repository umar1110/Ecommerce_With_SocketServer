const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");
const { unlinkProductImage } = require("../utils/unlinkFile");
const { ApiResponse } = require("../utils/ApiResponse");
const MainCategory = require("../models/mainCategoryModel");
const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");
const Review = require("../models/reviewModel");
// Create a new product
exports.createProduct = asyncHandler(async (req, res) => {
  const productImages = req.files?.productImages ? req.files.productImages : [];

  if (!productImages.length) {
    throw new ApiError(400, "Product Images are required");
  }

  const images = productImages.map((image) => {
  

    return {
      public_id: image.filename,
      url: `${req.protocol}://${req.get("host")}/uploads\\images\\products\\${
        image.filename
      }`,
    };
  });

  const {
    title,
    smallDescription,
    costPrice,
    salePrice,
    beforeDiscountPrice,
    mainCategories,
    categories,
    isFeatured,
    subCategories,
    stock,
    description,
    features,
  } = req.body;

  let product;
  // console.log(req.body);
  try {
    product = await Product.create({
      title,
      costPrice,
      salePrice,
      isFeatured,
      beforeDiscountPrice,
      mainCategories: mainCategories ? JSON.parse(mainCategories) : [],
      categories: categories ? JSON.parse(categories) : [],
      subCategories: subCategories ? JSON.parse(subCategories) : [],
      stock,
      description,
      features: features ? JSON.parse(features) : [],
      images,
      smallDescription,
      user: req.user._id,
    });
  } catch (error) {
    // Delete images if product creation failed

    console.log(error.message);
    images.forEach(async (image) => {
      await unlinkProductImage(image.public_id);
    });
    throw error;
  }

  return ApiResponse.success(res, {
    data: product,
    message: "Product created successfully",
  });
});

// Update a product
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  //  new Images to be uploaded
  const productImages = req.files?.productImages ? req.files.productImages : [];

  const images = productImages.map((image) => {
 

    return {
      public_id: image.filename,
      url: `${req.protocol}://${req.get("host")}/uploads\\images\\products\\${
        image.filename
      }`,
    };
  });

  const {
    title,
    costPrice,
    salePrice,
    isFeatured,
    beforeDiscountPrice,
    mainCategories,
    categories,
    subCategories,
    stock,
    description,
    features,
    smallDescription,
    oldImages,
    deletedOldImages,
  } = req.body;

  product.title = title;
  product.smallDescription = smallDescription;
  product.costPrice = costPrice;
  product.salePrice = salePrice;
  product.isFeatured = isFeatured;
  product.beforeDiscountPrice = beforeDiscountPrice;
  product.mainCategories = mainCategories ? JSON.parse(mainCategories) : [];
  product.categories = categories ? JSON.parse(categories) : [];
  product.subCategories = subCategories ? JSON.parse(subCategories) : [];
  product.stock = stock;
  product.description = description;
  product.features = features ? JSON.parse(features) : [];
  product.images = oldImages ? JSON.parse(oldImages) : [];
  const parsedDeletedOldImages = deletedOldImages
    ? JSON.parse(deletedOldImages)
    : [];
  if (parsedDeletedOldImages.length > 0) {
    parsedDeletedOldImages.forEach(async (image) => {
      try {
        await unlinkProductImage(image.public_id);
      } catch (error) {
        console.error("Failed to delete image:", error.message);
      }
    });
  }

  if (images.length > 0) {
    product.images = [...product.images, ...images];
  }

  await product.save({ validateBeforeSave: true });

  return ApiResponse.success(res, {
    data: product,
    message: "Product updated successfully",
  });
});

// Delete a product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const images = product.images.map((image) => image.public_id);
  images.forEach(async (image) => {
    try {
      await unlinkProductImage(image);
    } catch (error) {
      console.error("Failed to delete image:", error.message);
    }
  });

  // Delete reviews of product
  await Review.deleteMany({ product: req.params.id });

  return ApiResponse.success(res, {
    data: true,
    message: "Product deleted successfully",
  });
});

// Get all products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    mainCategory,
    subCategory,
    ratings,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};
  if (title) query.title = { $regex: title, $options: "i" };
  if (category) {
    const categoryDoc = await Category.findOne({
      name: category,
    });
    if (!categoryDoc) {
      throw new ApiError(404, "Category not found");
    }
    query.categories = categoryDoc._id;
  }
  if (mainCategory) {
    const mainCategoryDoc = await MainCategory.findOne({
      name: mainCategory,
    });
    if (!mainCategoryDoc) {
      throw new ApiError(404, "Main category not found");
    }
    query.mainCategories = mainCategoryDoc._id;
  }
  if (subCategory) {
    const mainCategoryDoc = await SubCategory.findOne({
      name: subCategory,
    });
    if (!mainCategoryDoc) {
      throw new ApiError(404, "Main category not found");
    }
    query.subCategories = mainCategoryDoc._id;
  }

  if (ratings) query.ratings = ratings;
  if (req.query.maxPrice)
    query.salePrice = { ...query.salePrice, $lte: req.query.maxPrice };
  if (req.query.minPrice)
    query.salePrice = { ...query.salePrice, $gte: req.query.minPrice };

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select("-description");

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  return ApiResponse.success(res, {
    data: {
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    },
  });

  // const { mainCategory } = req.query;

  // const mainCategoryDoc = await MainCategory.findOne({ name: mainCategory });
  // if (!mainCategoryDoc) {
  //   throw new ApiError(404, "Main category not found");
  // }
  // const products = await Product.find({ mainCategories: mainCategoryDoc._id });

  // return ApiResponse.success(res, {
  //   data: {
  //     products,
  //   },
  // });
});

//  Get product details
exports.getProductDetails = asyncHandler(async (req, res) => {
  var product;
  if (req.params.id) {
    product = await Product.findById(req.params.id);
  } else {
    // search on base of title with index search
    product = await Product.findOne({ title: req.body.title });
  }

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return ApiResponse.success(res, {
    data: product,
  });
});

// Get Home products
exports.getHomeProducts = asyncHandler(async (req, res) => {
  // Products with main category where isFeature is true
  //  Return in format [{mainCategory: {name: "name", products}}]
  //  Just top 10 latest products from each main category

  const mainCategories = await MainCategory.find({ isFeatured: true });
  const allProducts = [];
  for (const mainCategory of mainCategories) {
    // don't include cost price and useless fields

    const products = await Product.find({ mainCategories: mainCategory._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "-costPrice -description  -mainCategories -categories -subCategories"
      );

    allProducts.push({
      mainCategory: {
        name: mainCategory.name,
        products,
      },
    });
  }

  return ApiResponse.success(res, {
    data: allProducts,
  });
});

// Get featured products with pagination
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit } = req.query;

  if (limit) {
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-costPrice  -description   -categories -subCategories");

    const totalProducts = await Product.countDocuments({ isFeatured: true });
    const totalPages = Math.ceil(totalProducts / limit);

    return ApiResponse.success(res, {
      data: {
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: parseInt(page),
          pageSize: parseInt(limit),
        },
      },
    });
  }

  // Give all featured products
  const products = await Product.find({ isFeatured: true })
    .populate("mainCategories")
    .sort({ createdAt: -1 })
    .select("-costPrice -description  -categories -subCategories");
  return ApiResponse.success(res, {
    data: { products },
  });
});

// Change featured status of a product
exports.changeFeaturedStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isFeatured = !product.isFeatured;
  await product.save({ validateBeforeSave: false });

  return ApiResponse.success(res, {
    data: true,
    message: "Product featured status updated successfully",
  });
});
