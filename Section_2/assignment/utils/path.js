const path = require("path");

// to avoid using __dirname and ../ on the routes files
module.exports = path.dirname(require.main.filename);
