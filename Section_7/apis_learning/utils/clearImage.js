const fs = require("fs");
const path = require("path");

const rootDir = require("./path");
const { errorHandler } = require("./errorHandler");

exports.clearImage = (filePath) => {
  const absolutePath = path.join(rootDir, filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      const errorMessage = err.message || "Image not found";
      const error = errorHandler(500, errorMessage);
      throw error;
    }
  });
};
