const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter sub category name"],
      trim: true,
      maxLength: [100, "Sub category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.index({ name: 1 });
module.exports = mongoose.model("SubCategory", subCategorySchema);
