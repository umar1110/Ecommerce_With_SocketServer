const { randomUUID } = require("crypto");
const multer = require("multer");
const path = require("path");

// Storage for course images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "productImages") {
      cb(null, path.join(__dirname, ".././uploads/images/products"));
    } else if (file.fieldname === "reviewImages") {
      cb(null, path.join(__dirname, ".././uploads/images/reviews"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname));
  },
});

// Upload instance for both image and video
const uploadProductMedia = multer({
  storage: productStorage,
}).fields([
  { name: "productImages", maxCount: 10 },
  { name: "reviewImages", maxCount: 10 },
]);

module.exports = {
  uploadProductMedia,
};
