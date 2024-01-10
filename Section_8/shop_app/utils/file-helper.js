const fs = require("fs");
const path = require("path");
const rootDir = require("./path");

exports.deleteFile = (filePath) => {
  const absolutePath = path.join(rootDir, "public", filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) throw err;
  });
};
