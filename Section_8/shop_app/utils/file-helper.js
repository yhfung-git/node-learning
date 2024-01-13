const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const rootDir = require("./path");

exports.deleteFile = (filePath) => {
  const absolutePath = path.join(rootDir, "public", filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) throw err;
  });
};

exports.uploadImageToCloudinary = async (image) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (err, result) => {
          err ? reject(err) : resolve(result.secure_url);
        }
      );

      stream.end(image.buffer);
    });
  } catch (err) {
    throw err;
  }
};

exports.extractPublicId = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const parts = imageUrl.split("/");
      const filename = parts[parts.length - 1];
      const publicId = filename.split(".")[0];
      resolve(publicId);
    } catch (err) {
      reject(err);
    }
  });
};
