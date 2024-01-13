const cloudinary = require("cloudinary").v2;

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
