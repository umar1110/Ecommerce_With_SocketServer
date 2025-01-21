const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter category name"],
      trim: true,
      maxLength: [100, "Category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
    },
    mainCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "MainCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", categorySchema);
