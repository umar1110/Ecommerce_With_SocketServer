const cloudinary = require("cloudinary").v2;
const { getBase64 } = require("./helper");

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    console.error("Error uploading files to Cloudinary:", err);
    throw new Error("Error uploading files to cloudinary", err);
  }
};

const deletFilesFromCloudinary = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};

module.exports = {
  uploadFilesToCloudinary,
  deletFilesFromCloudinary,
};
