const path = require("path");
const rfs = require("rotating-file-stream");
const rootDir = require("../utils/path");

const customFormat =
  "[:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms";

const accessLogStream = rfs.createStream("access.log", {
  path: path.join(rootDir, "logs"),
  size: "10M",
  interval: "1d",
  compress: "gzip",
});

module.exports = {
  customFormat,
  accessLogStream,
};
