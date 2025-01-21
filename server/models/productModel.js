const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    costPrice: {
      type: Number,
    },
    beforeDiscountPrice: {
      type: Number,
    },
    smallDescription: {
      type: String,
      required: [true, "Please enter product small description"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
      required: [true, "Please enter product price"],
      default: 0.0,
    },
    ratings: {
      type: Number,
      default: 0,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    mainCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "MainCategory",
        required: [true, "Please enter product main category"],
      },
    ],
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 0,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },

    description: {
      type: String,
      required: [true, "Please enter product description"],
    },

    features: [
      {
        feature: {
          type: String,
          required: true,
        },
        values: [
          {
            type: {
              value: {
                type: String,
                required: true,
              },
              stock: {
                type: Number,
                required: true,
                default: 0,
              },
            },
          },
        ],
      },
    ],

    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexing for faster search

productModel.index({ title: 1 });
productModel.index({ category: 1 }); // For single-field queries on category
productModel.index({ mainCategory: 1 }); // For single-field queries on mainCategory
productModel.index({ subCategory: 1 }); // For single-field queries on subCategory
productModel.index({ ratings: 1 }, { sparse: true }); // For single-field queries on ratings
productModel.index({ salePrice: 1 }, { sparse: true }); // For single-field queries on salePrice

module.exports = mongoose.model("Product", productModel);
