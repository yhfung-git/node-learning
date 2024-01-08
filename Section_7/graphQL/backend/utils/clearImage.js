const fs = require("fs").promises;
const path = require("path");
const rootDir = require("./path");

exports.clearImage = async (filePath) => {
  try {
    const absolutePath = path.join(rootDir, filePath);

    await fs.unlink(absolutePath);
    return true;
  } catch (err) {
    console.error("clear image error:", err);
    throw err;
  }
};
