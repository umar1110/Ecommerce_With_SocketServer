const mongoose = require("mongoose");

const mainCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter main category name"],
      trim: true,
      maxLength: [100, "Main category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOffer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

mainCategorySchema.index({ name: 1 });

module.exports = mongoose.model("MainCategory", mainCategorySchema);
