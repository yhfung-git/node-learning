const fs = require("fs").promises;
const path = require("path");

const rootDir = require("./path");
const { errorHandler } = require("./errorHandler");

exports.clearImage = async (filePath) => {
  try {
    const absolutePath = path.join(rootDir, filePath);

    await fs.unlink(absolutePath);
    return true;
  } catch (err) {
    const errorMessage =
      err.message || "Image not found or failed to delete the image";

    throw errorHandler(500, errorMessage);
  }
};
