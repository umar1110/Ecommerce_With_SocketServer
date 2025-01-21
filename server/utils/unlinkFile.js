const fs = require("fs");
const path = require("path");

exports.unlinkProductImage = (imagePublicId) => {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(
      __dirname,
      "../uploads/images/products",
      imagePublicId
    );

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
        reject(err);
      } else {
        console.log("Old image deleted successfully .");
        resolve();
      }
    });
  });
};
exports.unlinkReviewImage = (imagePublicId) => {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(
      __dirname,
      "../uploads/images/reviews",
      imagePublicId
    );

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
        reject(err);
      } else {
        console.log("Image deleted successfully .");
        resolve();
      }
    });
  });
};
