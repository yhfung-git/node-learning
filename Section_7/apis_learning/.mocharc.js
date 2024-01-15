const { colors, symbols } = require("mocha/lib/reporters/base");

colors.pass = 32;
symbols.ok = "✓";

module.exports = {
  diff: true,
  extension: ["mjs"],
  package: "./package.json",
  reporter: "spec",
  slow: 75,
  timeout: 3000,
  ui: "bdd",
  "watch-files": ["test/**/*.mjs"],
  "watch-ignore": ["node_modules"],
  require: ["mocha", "chai"],
  spec: ["test/**/*.mjs"],
  colors: true,
  recursive: true,
  bail: false,
};
